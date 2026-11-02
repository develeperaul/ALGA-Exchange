import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const api = vi.hoisted(() => ({
  sendResetPasswordCode: vi.fn(), checkResetPasswordCode: vi.fn(), setResetPasswordPassword: vi.fn(),
  getProfile: vi.fn(), login: vi.fn(), sendRegisterCode: vi.fn(), checkRegisterCode: vi.fn(), setRegisterPassword: vi.fn(),
}));
vi.mock('../../src/api/auth', () => api);

let pinia: ReturnType<typeof createPinia>;
beforeEach(() => {
  vi.resetModules();
  for (const action of Object.values(api)) action.mockReset();
  vi.stubEnv('VITE_API_MODE', 'api');
  pinia = createPinia(); setActivePinia(pinia);
});
afterEach(() => { pinia?._s.forEach(store => store.$dispose()); vi.unstubAllEnvs(); });
async function setup() {
  const [{ useAuthStore }, session] = await Promise.all([import('../../src/stores/auth-store'), import('../../src/api/session')]);
  return { store: useAuthStore(), session };
}
const profile = (attrs: Record<string, unknown>, meta = { has_phone: false }) => ({
  data: { id: 'qa', type: 'customers', attributes: { email: 'qa@example.com', phone: null, ...attrs }, meta },
});

describe('reset password state', () => {
  it('clears the verification proof when the email changes and prevents final password submission', async () => {
    api.sendResetPasswordCode.mockResolvedValue({ data: { status: 'sent' } });
    api.checkResetPasswordCode.mockResolvedValue({ data: { token: 'proof-for-a' } });
    const { store } = await setup();
    await store.sendResetCode('A@example.com'); await store.checkResetCode('123456');
    expect(store.resetVerificationToken).toBe('proof-for-a');
    store.setResetEmail('B@example.com');
    expect(store.resetVerificationToken).toBe('');
    await expect(store.setResetPassword('test-only-password')).rejects.toMatchObject({ code: 'reset_verification_required' });
    expect(api.setResetPasswordPassword).not.toHaveBeenCalled();
  });

  it('ignores a stale code-check response after the reset flow is cleared', async () => {
    api.sendResetPasswordCode.mockResolvedValue({ data: { status: 'sent' } });
    let resolveCheck!: (value: unknown) => void;
    api.checkResetPasswordCode.mockImplementation(() => new Promise(resolve => { resolveCheck = resolve; }));
    const { store } = await setup();
    await store.sendResetCode('qa@example.com');
    const pending = store.checkResetCode('123456').catch(error => error);
    await vi.waitFor(() => expect(api.checkResetPasswordCode).toHaveBeenCalledTimes(1));
    store.resetPasswordFlow();
    resolveCheck({ data: { token: 'stale-proof' } });
    await pending;
    expect(store.resetVerificationToken).toBe('');
    expect(store.resetCodeSent).toBe(false);
  });

  it('accepts the final auth session, retains it after profile 503, and retries profile without another final POST', async () => {
    api.sendResetPasswordCode.mockResolvedValue({ data: { status: 'sent' } });
    api.checkResetPasswordCode.mockResolvedValue({ data: { token: 'proof' } });
    api.setResetPasswordPassword.mockResolvedValue({ data: { attributes: { token: 'new-session', expires_at: null } } });
    api.getProfile.mockRejectedValueOnce(Object.assign(new Error('unavailable'), { status: 503 }))
      .mockResolvedValue(profile({ provider_kyc: { provider: 'x', is_verified: true }, phone: null }));
    const { store, session } = await setup();
    await store.sendResetCode('qa@example.com'); await store.checkResetCode('123456');
    await expect(store.setResetPassword('test-only-password')).rejects.toMatchObject({ status: 503 });
    expect(store.token).toBe('new-session');
    expect(store.status).toBe('error');
    expect(api.setResetPasswordPassword).toHaveBeenCalledTimes(1);
    await store.fetchProfile();
    expect(api.setResetPasswordPassword).toHaveBeenCalledTimes(1);
    expect(api.getProfile).toHaveBeenCalledTimes(2);
    expect(store.profilePhone).toBe('');
    expect(store.hasPhone).toBe(false);
    expect(store.verificationStatus).toBe('approved');
    expect(store.isVerified).toBe(true);
    store.logout();
    expect(store.token).toBe('');
    expect(store.status).toBe('guest');
    expect(session.readSession()).toBeNull();
  });

  it('returns to guest after profile recovery loses the accepted reset session', async () => {
    const { ApiError } = await import('../../src/api/errors');
    api.sendResetPasswordCode.mockResolvedValue({ data: { status: 'sent' } });
    api.checkResetPasswordCode.mockResolvedValue({ data: { token: 'proof' } });
    api.setResetPasswordPassword.mockResolvedValue({ data: { attributes: { token: 'new-session', expires_at: null } } });
    api.getProfile.mockRejectedValueOnce(new ApiError('unavailable', 503, 'http_error'))
      .mockRejectedValueOnce(new ApiError('expired', 401, 'unauthorized'));
    const { store, session } = await setup();
    await store.sendResetCode('qa@example.com'); await store.checkResetCode('123456');
    await expect(store.setResetPassword('test-only-password')).rejects.toMatchObject({ status: 503 });
    await expect(store.fetchProfile()).rejects.toMatchObject({ status: 401 });
    expect(api.setResetPasswordPassword).toHaveBeenCalledTimes(1);
    expect(store.status).toBe('guest');
    expect(store.token).toBe('');
    expect(store.profile).toBeNull();
    expect(session.readSession()).toBeNull();
  });
});
