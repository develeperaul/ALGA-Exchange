import { defineStore } from 'pinia';
import { computed, ref, watch, onScopeDispose } from 'vue';
import { checkRegisterCode as checkCodeRequest, getProfile, login as loginRequest,
  sendRegisterCode as sendCodeRequest, setRegisterPassword as setPasswordRequest,
  sendResetPasswordCode, checkResetPasswordCode, setResetPasswordPassword } from '@/api/auth';
import { ApiError, invalidResponse } from '@/api/errors';
import { isMockMode } from '@/api/config';
import { clearSession, getSessionScope, isCurrentSession, isValidSession, onSessionChange,
  readSession, replaceSession, type AuthSession } from '@/api/session';
import { KYC_API_STATUS, type KycVerificationStatus, type ProfileApiData, type ProfileData } from '@/models';

export type AuthStatus = 'guest' | 'restoring' | 'authenticated' | 'error';

function resolveVerificationStatus(data: ProfileApiData): KycVerificationStatus {
  if (!isMockMode) {
    const provider = data.attributes?.provider_kyc;
    if (provider?.is_verified === true) return 'approved';
    return provider?.kyc_status === 'pending' || provider?.kyc_status === 'rejected' ? provider.kyc_status : 'unverified';
  }
  const kyc = data.attributes?.kyc ?? null;
  const hasKyc = Boolean(data.meta?.has_kyc);

  if (!hasKyc || !kyc) {
    return 'unverified';
  }

  if (kyc.status === KYC_API_STATUS.APPROVED) {
    return 'approved';
  }

  if (kyc.status === KYC_API_STATUS.REJECTED || Boolean(kyc.identification_error)) {
    return 'rejected';
  }

  // Pending is also the safe fallback for an unknown raw status: identity
  // must never be considered verified until the API explicitly approves it.
  return 'pending';
}

function normalizeProfile(data: ProfileApiData): ProfileData {
  const attributes = data.attributes;
  const meta = data.meta;
  const kyc = isMockMode ? attributes?.kyc ?? null : null;
  const firstName = attributes?.first_name || '';
  const lastName = attributes?.last_name || '';
  const middleName = attributes?.middle_name || '';
  const fullName = [
    lastName,
    firstName,
    middleName,
  ].filter(Boolean).join(' ');
  const name = isMockMode ? attributes?.full_name || attributes?.name || fullName : '';
  const email = attributes?.email || '';
  const phone = attributes?.phone || '';
  const hasKyc = isMockMode ? Boolean(meta?.has_kyc) : Boolean(attributes?.provider_kyc);
  const hasPhone = Boolean(meta?.has_phone);
  const kycStatus = kyc?.status ?? null;
  const kycBlocked = Boolean(kyc?.is_blocked);
  const verificationStatus = resolveVerificationStatus(data);
  const verified = verificationStatus === 'approved';

  return {
    id: data.id,
    type: data.type,
    attributes,
    email,
    phone,
    kyc,
    hasKyc,
    hasPhone,
    kycStatus,
    verificationStatus,
    kycBlocked,
    name,
    verified,
  };
}

function sessionFromResponse(response: unknown): AuthSession {
  const attributes = (response as { data?: { attributes?: Partial<AuthSession> } })?.data?.attributes;
  if (!attributes || !isValidSession(attributes)) throw invalidResponse();
  return { token: attributes.token, expires_at: attributes.expires_at };
}
function cancelled() { return new DOMException('Запрос отменён', 'AbortError'); }

export const useAuthStore = defineStore('auth', () => {
  const email = ref('');
  const verificationToken = ref('');
  const token = ref(getSessionScope().session?.token || '');
  const profile = ref<ProfileData | null>(null);
  const status = ref<AuthStatus>('guest');
  const error = ref<Error | null>(null);
  const isLoading = ref(false);
  const registrationEmail = ref('');
  const registrationCodeSent = ref(false);
  const resetEmail = ref('');
  const resetCodeSent = ref(false);
  const resetVerificationToken = ref('');
  let resetRevision = 0;
  let pendingReset: { controller: AbortController; busy: symbol } | null = null;
  let registrationRevision = 0;
  let operation = 0;
  let loadingOwner: symbol | null = null;
  let pendingLogin: { controller: AbortController; busy: symbol } | null = null;
  let restored = false;
  let restorePromise: Promise<ProfileData | null> | null = null;
  let profileFlight: { epoch: number; promise: Promise<ProfileData | null> } | null = null;

  /** Call on back/unmount or email edits; reset proofs never leave store memory. */
  function resetPasswordFlow() {
    resetRevision += 1;
    const pending = pendingReset;
    pendingReset = null;
    pending?.controller.abort();
    if (pending && loadingOwner === pending.busy) {
      loadingOwner = null;
      isLoading.value = false;
    }
    resetEmail.value = '';
    resetCodeSent.value = false;
    resetVerificationToken.value = '';
  }
  watch(resetEmail, () => {
    resetRevision += 1;
    pendingReset?.controller.abort();
    resetCodeSent.value = false;
    resetVerificationToken.value = '';
  }, { flush: 'sync' });
  function setResetEmail(value: string) {
    const normalized = value.trim().toLowerCase();
    if (resetEmail.value !== normalized) {
      resetPasswordFlow();
      resetEmail.value = normalized;
    }
  }
  async function runResetRequest<T, R>(request: (signal: AbortSignal) => Promise<T>, accept: (response: T) => R | Promise<R>) {
    pendingReset?.controller.abort();
    const revision = ++resetRevision;
    const scope = getSessionScope();
    const attempt = { controller: new AbortController(), busy: Symbol() };
    pendingReset = attempt;
    const abort = () => attempt.controller.abort();
    if (scope.signal.aborted) abort();
    else scope.signal.addEventListener('abort', abort, { once: true });
    loadingOwner = attempt.busy;
    isLoading.value = true;
    try {
      const response = await request(attempt.controller.signal);
      if (pendingReset !== attempt || attempt.controller.signal.aborted
        || revision !== resetRevision || !isCurrentSession(scope.epoch)) throw cancelled();
      const result = accept(response);
      if (result instanceof Promise) {
        loadingOwner = attempt.busy;
        isLoading.value = true;
      }
      return await result;
    } finally {
      scope.signal.removeEventListener('abort', abort);
      if (pendingReset === attempt) pendingReset = null;
      if (loadingOwner === attempt.busy) { loadingOwner = null; isLoading.value = false; }
    }
  }
  async function sendResetCode(value: string) {
    setResetEmail(value);
    resetCodeSent.value = false;
    resetVerificationToken.value = '';
    const valueEmail = resetEmail.value;
    await runResetRequest(signal => sendResetPasswordCode({ email: valueEmail }, signal), () => {
      resetCodeSent.value = true;
    });
  }
  async function checkResetCode(code: string) {
    if (!resetCodeSent.value || !resetEmail.value) throw new ApiError('Сначала запросите код', null, 'reset_code_required');
    resetVerificationToken.value = '';
    const valueEmail = resetEmail.value;
    await runResetRequest(signal => checkResetPasswordCode({ email: valueEmail, code }, signal), response => {
      if (typeof response?.data?.token !== 'string' || !response.data.token.trim()) throw invalidResponse();
      resetVerificationToken.value = response.data.token;
    });
  }
  async function setResetPassword(password: string) {
    if (!resetVerificationToken.value || !resetEmail.value) throw new ApiError('Сначала подтвердите код', null, 'reset_verification_required');
    const proof = resetVerificationToken.value;
    // Accept synchronously inside the stale guard. Profile recovery can outlive UI teardown.
    return runResetRequest(signal => setResetPasswordPassword({ token: proof, password }, signal), response => {
      sessionFromResponse(response);
      pendingReset = null;
      return acceptSession(response);
    });
  }
  function resetRegistration() {
    registrationRevision += 1;
    loadingOwner = null;
    isLoading.value = false;
    registrationEmail.value = '';
    registrationCodeSent.value = false;
    verificationToken.value = '';
  }
  function setRegistrationEmail(value: string) {
    const normalized = value.trim().toLowerCase();
    if (registrationEmail.value !== normalized) {
      resetRegistration();
      registrationEmail.value = normalized;
    }
    email.value = normalized;
  }
  function resumeRegistration(value: string) {
    resetRegistration();
    setRegistrationEmail(value);
    registrationCodeSent.value = true;
  }
  const unsubscribe = onSessionChange(() => {
    cancelLogin();
    operation += 1;
    const session = getSessionScope().session;
    token.value = session?.token || '';
    profile.value = null;
    error.value = null;
    status.value = session ? 'restoring' : 'guest';
    isLoading.value = false;
    loadingOwner = null;
    profileFlight = null;
    resetRegistration();
    resetPasswordFlow();
    if (!session) email.value = '';
  });
  // Pinia disposes setup-store effect scopes along with their subscriptions.
  onScopeDispose(() => { unsubscribe(); resetPasswordFlow(); });

  function fetchProfile(options: { background?: boolean } = {}): Promise<ProfileData | null> {
    const scope = getSessionScope();
    if (!scope.session) return Promise.resolve(null);
    if (!isValidSession(scope.session)) { clearSession(scope.epoch); return Promise.resolve(null); }
    if (profileFlight?.epoch === scope.epoch) return profileFlight.promise;
    const keepCached = Boolean(options.background && profile.value);
    if (!keepCached) status.value = 'restoring';
    error.value = null;
    const promise = (async () => {
      try {
        const response = await getProfile(scope.signal);
        if (!isCurrentSession(scope.epoch)) throw cancelled();
        const data = response?.data;
        if (!data || typeof data.id !== 'string' || typeof data.type !== 'string'
          || typeof data.attributes?.email !== 'string' || !data.meta) throw invalidResponse();
        profile.value = normalizeProfile(data);
        email.value = profile.value.email;
        status.value = 'authenticated';
        return profile.value;
      } catch (cause) {
        if (isCurrentSession(scope.epoch)) {
          if (cause instanceof ApiError && cause.status === 401) clearSession(scope.epoch);
          else {
            error.value = cause as Error;
            if (!keepCached) { profile.value = null; status.value = 'error'; }
          }
        }
        throw cause;
      } finally {
        if (profileFlight?.epoch === scope.epoch) profileFlight = null;
      }
    })();
    profileFlight = { epoch: scope.epoch, promise };
    return promise;
  }
  function restore(): Promise<ProfileData | null> {
    if (restorePromise) return restorePromise;
    if (restored) return Promise.resolve(profile.value);
    restored = true;
    const stored = readSession();
    if (!getSessionScope().session && stored) replaceSession(stored);
    restorePromise = fetchProfile().catch(() => null).finally(() => { restorePromise = null; });
    return restorePromise;
  }
  async function acceptSession(response: unknown) {
    const session = sessionFromResponse(response);
    restored = true;
    replaceSession(session);
    resetRegistration();
    return fetchProfile();
  }
  /** Invalidates only a login response that has not yet accepted its session. */
  function cancelLogin() {
    const pending = pendingLogin;
    if (!pending) return;
    pendingLogin = null;
    pending.controller.abort();
    if (loadingOwner === pending.busy) {
      loadingOwner = null;
      isLoading.value = false;
    }
  }
  async function login(value: string, password: string) {
    cancelLogin();
    const id = ++operation;
    const scope = getSessionScope();
    const busy = Symbol();
    const attempt = { controller: new AbortController(), busy };
    pendingLogin = attempt;
    const abort = () => attempt.controller.abort();
    if (scope.signal.aborted) abort();
    else scope.signal.addEventListener('abort', abort, { once: true });
    loadingOwner = busy;
    isLoading.value = true;
    try {
      const response = await loginRequest({ email: value.trim().toLowerCase(), password }, attempt.controller.signal);
      if (pendingLogin !== attempt || attempt.controller.signal.aborted
        || operation !== id || !isCurrentSession(scope.epoch)) throw cancelled();
      // Cancellation after this point must preserve the accepted session/profile recovery.
      pendingLogin = null;
      const result = acceptSession(response);
      loadingOwner = busy;
      isLoading.value = true;
      return await result;
    } finally {
      scope.signal.removeEventListener('abort', abort);
      if (pendingLogin === attempt) pendingLogin = null;
      if (loadingOwner === busy) { loadingOwner = null; isLoading.value = false; }
    }
  }
  async function sendRegisterCode(value: string) {
    setRegistrationEmail(value);
    verificationToken.value = '';
    registrationCodeSent.value = false;
    const revision = ++registrationRevision;
    const scope = getSessionScope();
    const busy = Symbol();
    loadingOwner = busy;
    isLoading.value = true;
    try {
      await sendCodeRequest({ email: registrationEmail.value }, scope.signal);
      if (revision !== registrationRevision || !isCurrentSession(scope.epoch)) throw cancelled();
      registrationCodeSent.value = true;
    } finally { if (loadingOwner === busy) { loadingOwner = null; isLoading.value = false; } }
  }
  async function checkRegisterCode(code: string) {
    if (!registrationCodeSent.value || !registrationEmail.value) throw new ApiError('Сначала запросите код', null, 'registration_code_required');
    const revision = ++registrationRevision;
    const scope = getSessionScope();
    verificationToken.value = '';
    const busy = Symbol();
    loadingOwner = busy;
    isLoading.value = true;
    try {
      const response = await checkCodeRequest({ email: registrationEmail.value, code }, scope.signal);
      if (revision !== registrationRevision || !isCurrentSession(scope.epoch)) throw cancelled();
      if (typeof response?.data?.token !== 'string' || !response.data.token.trim()) throw invalidResponse();
      verificationToken.value = response.data.token;
    } finally { if (loadingOwner === busy) { loadingOwner = null; isLoading.value = false; } }
  }
  async function setRegisterPassword(password: string) {
    if (!verificationToken.value || !registrationEmail.value) throw new ApiError('Сначала подтвердите код', null, 'registration_verification_required');
    const revision = ++registrationRevision;
    const id = ++operation;
    const scope = getSessionScope();
    const busy = Symbol();
    loadingOwner = busy;
    isLoading.value = true;
    try {
      const response = await setPasswordRequest({ token: verificationToken.value, password }, scope.signal);
      if (revision !== registrationRevision || id !== operation || !isCurrentSession(scope.epoch)) throw cancelled();
      const result = acceptSession(response);
      loadingOwner = busy;
      isLoading.value = true;
      return await result;
    } finally { if (loadingOwner === busy) { loadingOwner = null; isLoading.value = false; } }
  }
  function logout() { restored = true; clearSession(); resetRegistration(); resetPasswordFlow(); }

  return {
    email, verificationToken, token, profile, status, error, isLoading,
    sessionStatus: status, sessionError: error,
    registrationEmail, registrationCodeSent,
    resetEmail, resetCodeSent, resetVerificationToken,
    setResetEmail, resetPasswordFlow, sendResetCode, checkResetCode, setResetPassword,
    isAuthenticated: computed(() => status.value === 'authenticated' && Boolean(token.value && profile.value)),
    profileEmail: computed(() => profile.value?.email || email.value),
    profilePhone: computed(() => profile.value?.phone || ''),
    profileName: computed(() => profile.value?.name || ''),
    hasKyc: computed(() => Boolean(profile.value?.hasKyc)),
    hasPhone: computed(() => Boolean(profile.value?.hasPhone)),
    kycStatus: computed(() => profile.value?.kycStatus ?? null),
    verificationStatus: computed<KycVerificationStatus>(() => profile.value?.verificationStatus ?? 'unverified'),
    kycBlocked: computed(() => Boolean(profile.value?.kycBlocked)),
    isVerified: computed(() => Boolean(profile.value?.verified)),
    hydrate: restore, restore, fetchProfile, acceptSession, login, cancelLogin, logout,
    setRegistrationEmail, resetRegistration, resumeRegistration, sendRegisterCode, checkRegisterCode, setRegisterPassword,
  };
});
