import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const api = vi.hoisted(() => ({ sendRegisterCode: vi.fn(), checkRegisterCode: vi.fn(), setRegisterPassword: vi.fn(), getProfile: vi.fn(), login: vi.fn() }));
vi.mock('@/api/auth', () => ({ ...api }));

const sessionResponse = (token = 'registered-session') => ({ data: { attributes: { token, expires_at: null } } });
const profileResponse = { data: { id: 'qa', type: 'customers', attributes: { email: 'qa@example.com', provider_kyc: { provider: 'example', is_verified: false } }, meta: { has_phone: false } } };
let pinia: ReturnType<typeof createPinia>;
beforeEach(() => { vi.resetModules(); api.sendRegisterCode.mockReset(); api.checkRegisterCode.mockReset(); api.setRegisterPassword.mockReset(); api.getProfile.mockReset(); api.login.mockReset(); vi.stubEnv('VITE_API_MODE', 'api'); vi.stubEnv('VITE_API_BASE_URL', 'https://example.com'); pinia = createPinia(); setActivePinia(pinia); });
afterEach(() => { pinia?._s.forEach(store => store.$dispose()); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
async function setup() {
  const [{ useAuthStore }, session] = await Promise.all([import('../../src/stores/auth-store'), import('../../src/api/session')]);
  return { store: useAuthStore(), session };
}

describe('registration proof and session bootstrap', () => {
  it('cancels a pending login before starting registration and ignores the late login result', async () => {
    let finishLogin!: (result: unknown) => void;
    api.login.mockImplementation(() => new Promise(resolve => { finishLogin = resolve; }));
    const { store } = await setup();
    const pending = store.login('qa@example.com', 'test-only-password').catch(error => error);
    await vi.waitFor(() => expect(api.login).toHaveBeenCalledTimes(1));
    store.cancelLogin();
    store.resumeRegistration('qa@example.com');
    finishLogin(sessionResponse('late-login-session'));
    await pending;
    expect(store.token).toBe('');
    expect(store.status).toBe('guest');
    expect(store.registrationEmail).toBe('qa@example.com');
    expect(store.registrationCodeSent).toBe(true);
    expect(store.verificationToken).toBe('');
    expect(api.getProfile).not.toHaveBeenCalled();
  });

  it('does not accept a verification proof when code verification fails', async () => {
    api.sendRegisterCode.mockResolvedValue(undefined);
    api.checkRegisterCode.mockRejectedValue(Object.assign(new Error('Неверный код'), { status: 422, code: 'code_invalid' }));
    const { store } = await setup();
    await store.sendRegisterCode('QA@example.com');
    await expect(store.checkRegisterCode('111111')).rejects.toMatchObject({ status: 422, code: 'code_invalid' });
    expect(store.verificationToken).toBe('');
    await expect(store.setRegisterPassword('test-only-password')).rejects.toMatchObject({ code: 'registration_verification_required' });
    expect(api.setRegisterPassword).not.toHaveBeenCalled();
  });

  it('invalidates the old proof when email changes and sends later requests only for the new email', async () => {
    api.sendRegisterCode.mockResolvedValue(undefined);
    api.checkRegisterCode.mockResolvedValueOnce({ data: { token: 'proof-for-a' } }).mockResolvedValueOnce({ data: { token: 'proof-for-b' } });
    const { store } = await setup();
    await store.sendRegisterCode('A@example.com');
    await store.checkRegisterCode('123456');
    store.setRegistrationEmail('B@example.com');
    await expect(store.setRegisterPassword('test-only-password')).rejects.toMatchObject({ code: 'registration_verification_required' });
    await store.sendRegisterCode('B@example.com');
    await store.checkRegisterCode('654321');
    expect(api.sendRegisterCode.mock.calls).toEqual([[{ email: 'a@example.com' }, expect.any(AbortSignal)], [{ email: 'b@example.com' }, expect.any(AbortSignal)]]);
    expect(api.checkRegisterCode.mock.calls.map(([payload]) => payload)).toEqual([
      { email: 'a@example.com', code: '123456' }, { email: 'b@example.com', code: '654321' },
    ]);
    expect(store.verificationToken).toBe('proof-for-b');
  });

  it('keeps the accepted token after profile 503 and retries only profile bootstrap', async () => {
    api.sendRegisterCode.mockResolvedValue(undefined);
    api.checkRegisterCode.mockResolvedValue({ data: { token: 'proof' } });
    api.setRegisterPassword.mockResolvedValue(sessionResponse());
    api.getProfile.mockRejectedValueOnce(Object.assign(new Error('Service unavailable'), { status: 503 })).mockResolvedValue(profileResponse);
    const { store, session } = await setup();
    await store.sendRegisterCode('qa@example.com');
    await store.checkRegisterCode('123456');
    await expect(store.setRegisterPassword('test-only-password')).rejects.toMatchObject({ status: 503 });
    expect(store.status).toBe('error');
    expect(store.isAuthenticated).toBe(false);
    expect(session.getSessionScope().session).toEqual({ token: 'registered-session', expires_at: null });
    await store.fetchProfile();
    expect(store.isAuthenticated).toBe(true);
    expect(api.setRegisterPassword).toHaveBeenCalledTimes(1);
    expect(api.getProfile).toHaveBeenCalledTimes(2);
  });

  it('ignores a late registration-code response after registration reset', async () => {
    let resolve!: () => void;
    api.sendRegisterCode.mockImplementation(() => new Promise<void>(done => { resolve = done; }));
    const { store } = await setup();
    const pending = store.sendRegisterCode('qa@example.com').catch(error => error);
    await vi.waitFor(() => expect(api.sendRegisterCode).toHaveBeenCalledTimes(1));
    store.resetRegistration();
    resolve();
    await pending;
    expect(store.registrationCodeSent).toBe(false);
    expect(store.registrationEmail).toBe('');
  });
});
