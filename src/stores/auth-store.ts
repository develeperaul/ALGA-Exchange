import { defineStore } from 'pinia';
import { HTTPError } from 'ky';
import {
  checkRegisterCode as checkRegisterCodeRequest,
  getProfile as getProfileRequest,
  login as loginRequest,
  sendRegisterCode as sendRegisterCodeRequest,
  setRegisterPassword as setRegisterPasswordRequest,
} from '@/api/auth';
import {
  KYC_API_STATUS,
  type KycVerificationStatus,
  type ProfileApiData,
  type ProfileData,
} from '@/models';
import { getStoredToken, setStoredToken } from '@/utils/auth-token';

function resolveVerificationStatus(data: ProfileApiData): KycVerificationStatus {
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
  const kyc = attributes?.kyc ?? null;
  const firstName = attributes?.first_name || '';
  const lastName = attributes?.last_name || '';
  const middleName = attributes?.middle_name || '';
  const fullName = [
    lastName,
    firstName,
    middleName,
  ].filter(Boolean).join(' ');
  const name = attributes?.full_name || attributes?.name || fullName;
  const email = attributes?.email || '';
  const phone = attributes?.phone || '';
  const hasKyc = Boolean(meta?.has_kyc);
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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: '',
    verificationToken: '',
    token: '',
    profile: null as ProfileData | null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    profileEmail: (state) => state.profile?.email || state.email || '',
    profilePhone: (state) => state.profile?.phone || '',
    profileName: (state) => state.profile?.name || '',
    hasKyc: (state) => Boolean(state.profile?.hasKyc),
    hasPhone: (state) => Boolean(state.profile?.hasPhone),
    kycStatus: (state) => state.profile?.kycStatus ?? null,
    verificationStatus: (state): KycVerificationStatus => state.profile?.verificationStatus ?? 'unverified',
    kycBlocked: (state) => Boolean(state.profile?.kycBlocked),
    isVerified: (state) => Boolean(state.profile?.verified),
  },
  actions: {
    hydrate() {
      this.token = getStoredToken();

      if (this.token) {
        void this.fetchProfile();
      }
    },
    async fetchProfile() {
      if (!this.token) {
        this.profile = null;
        return null;
      }

      try {
        const response = await getProfileRequest();
        const profile = normalizeProfile(response.data);

        this.profile = profile;
        this.email = profile.email || this.email;

        return profile;
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 401) {
          this.logout();
        }

        return null;
      }
    },
    async login(email: string, password: string) {
      this.isLoading = true;

      try {
        const response = await loginRequest({
          email,
          password,
        });

        this.email = email;
        this.token = response.data.attributes.token;
        setStoredToken(this.token);
        await this.fetchProfile();
      } finally {
        this.isLoading = false;
      }
    },
    async sendRegisterCode(email: string) {
      this.isLoading = true;

      try {
        await sendRegisterCodeRequest({ email });
        this.email = email;
      } finally {
        this.isLoading = false;
      }
    },
    async checkRegisterCode(code: string) {
      this.isLoading = true;

      try {
        const response = await checkRegisterCodeRequest({
          email: this.email,
          code,
        });

        this.verificationToken = response.data.token;
      } finally {
        this.isLoading = false;
      }
    },
    async setRegisterPassword(password: string) {
      this.isLoading = true;

      try {
        const response = await setRegisterPasswordRequest({
          token: this.verificationToken,
          password,
        });

        const token = response.data?.attributes?.token || response.data?.token || '';

        this.token = token;
        setStoredToken(token);
        await this.fetchProfile();
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.email = '';
      this.verificationToken = '';
      this.token = '';
      this.profile = null;
      this.isLoading = false;
      setStoredToken('');
    },
  },
});
