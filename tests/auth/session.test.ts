// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key), clear: () => values.clear() };
}
const storage = { localStorage: memoryStorage(), sessionStorage: memoryStorage() };
vi.stubGlobal('window', storage);
vi.stubGlobal('localStorage', storage.localStorage);
vi.stubGlobal('sessionStorage', storage.sessionStorage);

const authResponse = (token = 'test-token') => ({ data: { attributes: { token, expires_at: null } } });
const profile = { data: { id: '1', type: 'customers', attributes: { email: 'test@example.com', phone: null, provider_kyc: null }, meta: { has_phone: false } } };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
let pinia: ReturnType<typeof createPinia>;
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_BASE_URL', 'http://localhost');
  vi.stubEnv('VITE_API_MODE', 'api');
  pinia = createPinia();
  setActivePinia(pinia);
});
afterEach(() => { pinia._s.forEach(store => store.$dispose()); vi.unstubAllEnvs(); });
async function setup(fetch: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetch);
  const { useAuthStore } = await import('../../src/stores/auth-store');
  const session = await import('../../src/api/session');
  return { store: useAuthStore(), session };
}

describe('real authentication session', () => {
  it('bootstraps once per app session and keeps cached profile visible during foreground refresh', async () => {
    const fetch = vi.fn().mockResolvedValue(json(profile));
    const { store, session } = await setup(fetch);
    storage.sessionStorage.setItem(session.SESSION_STORAGE_KEY, JSON.stringify({ token: 'cache-test-token', expires_at: null }));
    await Promise.all([store.restore(), store.restore()]);
    expect(fetch).toHaveBeenCalledTimes(1);
    await store.restore();
    expect(fetch).toHaveBeenCalledTimes(1);
    let finish!: (value: Response) => void;
    fetch.mockImplementationOnce(() => new Promise<Response>(resolve => { finish = resolve; }));
    const refresh = store.fetchProfile({ background: true });
    expect(store.status).toBe('authenticated');
    expect(store.profile?.email).toBe('test@example.com');
    await vi.waitFor(() => expect(finish).toBeTypeOf('function'));
    finish(json(profile));
    await refresh;
    expect(fetch).toHaveBeenCalledTimes(2);
    store.logout();
    expect(store.profile).toBeNull();
  });

  it('registers with JSON requests, no public bearer, and bootstraps nullable-expiry session', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ data: { status: 'sent' } }, 202))
      .mockResolvedValueOnce(json({ data: { token: 'verification-only' } }))
      .mockResolvedValueOnce(json(authResponse())).mockResolvedValueOnce(json(profile));
    const { store, session } = await setup(fetch);
    await store.sendRegisterCode('TEST@example.com');
    await store.checkRegisterCode('123456');
    await store.setRegisterPassword('example-password');
    expect(store.isAuthenticated).toBe(true);
    expect(store.profileName).toBe('');
    expect(fetch.mock.calls.map(([r]) => new URL(r.url).pathname)).toEqual([
      '/api/auth/register/codes', '/api/auth/register/codes/check', '/api/auth/register/passwords', '/api/profile/me',
    ]);
    for (const [request] of fetch.mock.calls.slice(0, 3)) {
      expect(request.headers.get('Accept')).toBe('application/json');
      expect(request.headers.get('Content-Type')).toContain('application/json');
      expect(request.headers.has('Authorization')).toBe(false);
    }
    expect(fetch.mock.calls[3][0].headers.get('Authorization')).toBe('Bearer test-token');
    expect(JSON.parse(sessionStorage.getItem(session.SESSION_STORAGE_KEY)!)).toEqual({ token: 'test-token', expires_at: null });
    expect(store.verificationToken).toBe('');
  });
  it('single-flights restoration and ignores legacy localStorage token', async () => {
    localStorage.setItem('auth_token', 'legacy');
    const fetch = vi.fn().mockResolvedValue(json(profile));
    const { store, session } = await setup(fetch);
    await store.restore();
    expect(fetch).not.toHaveBeenCalled();
    session.replaceSession({ token: 'real', expires_at: null });
    await Promise.all([store.fetchProfile(), store.fetchProfile()]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('rejects empty tokens and does not issue a profile request', async () => {
    const fetch = vi.fn().mockResolvedValue(json(authResponse('')));
    const { store } = await setup(fetch);
    await expect(store.login('test@example.com', 'password')).rejects.toMatchObject({ code: 'invalid_response' });
    expect(store.isAuthenticated).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('does not turn profile failures into login success, and keeps session for retry', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json(authResponse())).mockRejectedValue(new TypeError('offline'));
    const { store, session } = await setup(fetch);
    await expect(store.login('test@example.com', 'password')).rejects.toMatchObject({ code: 'network_error' });
    expect(store.status).toBe('error');
    expect(store.isAuthenticated).toBe(false);
    expect(session.getSessionScope().session?.token).toBe('test-token');
    fetch.mockResolvedValue(json(profile));
    await store.fetchProfile();
    expect(store.isAuthenticated).toBe(true);
  });
  it('clears current session on 401', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ errors: [{ code: 'unauthorized', message: 'Войдите снова' }] }, 401));
    const { store, session } = await setup(fetch);
    session.replaceSession({ token: 'active', expires_at: null });
    await expect(store.fetchProfile()).rejects.toMatchObject({ status: 401, code: 'unauthorized' });
    expect(store.status).toBe('guest');
    expect(session.getSessionScope().session).toBe(null);
  });
  it('late 401 from A cannot clear B, and logout aborts scoped requests', async () => {
    let reply!: (response: Response) => void;
    const fetch = vi.fn().mockImplementationOnce(() => new Promise(resolve => { reply = resolve; })).mockResolvedValue(json(profile));
    const { store, session } = await setup(fetch);
    session.replaceSession({ token: 'A', expires_at: null });
    const pending = store.fetchProfile().catch(error => error);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const oldSignal = fetch.mock.calls[0][0].signal;
    session.replaceSession({ token: 'B', expires_at: null });
    await store.fetchProfile();
    reply(json({ errors: [] }, 401));
    await pending;
    expect(oldSignal.aborted).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.token).toBe('B');
    const signal = session.getSessionScope().signal;
    store.logout();
    expect(signal.aborted).toBe(true);
    expect(store.profile).toBe(null);
  });
  it('clears verification when registration email changes', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ data: { status: 'sent' } }))
      .mockResolvedValueOnce(json({ data: { token: 'code-proof' } }));
    const { store } = await setup(fetch);
    await store.sendRegisterCode('a@example.com');
    await store.checkRegisterCode('123456');
    store.setRegistrationEmail('b@example.com');
    expect(store.verificationToken).toBe('');
    expect(store.registrationCodeSent).toBe(false);
    await expect(store.setRegisterPassword('password')).rejects.toMatchObject({ code: 'registration_verification_required' });
  });
  it('preserves server error messages and never retries a POST', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ errors: [{ code: 'email_invalid', message: 'Проверьте почту' }] }, 422));
    const { store } = await setup(fetch);
    await expect(store.sendRegisterCode('bad')).rejects.toMatchObject({ status: 422, code: 'email_invalid', message: 'Проверьте почту' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('rejects expired storage and isolates mock storage from api storage', async () => {
    const fetch = vi.fn();
    const { store, session } = await setup(fetch);
    sessionStorage.setItem('alga:session:v1:mock', JSON.stringify({ token: 'demo', expires_at: null }));
    sessionStorage.setItem(session.SESSION_STORAGE_KEY, JSON.stringify({ token: 'expired', expires_at: '2000-01-01T00:00:00Z' }));
    await store.restore();
    expect(store.status).toBe('guest');
    expect(fetch).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(session.SESSION_STORAGE_KEY)).toBe(null);
  });
  it('uses provider is_verified and ignores legacy KYC fields in api mode', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ data: { ...profile.data,
      attributes: { ...profile.data.attributes, full_name: 'legacy name', kyc: { status: 1, is_blocked: true },
        provider_kyc: { provider: 'antarctic', is_verified: false, kyc_status: 'approved' } },
      meta: { has_phone: false, has_kyc: true } } }));
    const { store, session } = await setup(fetch);
    session.replaceSession({ token: 'active', expires_at: null });
    await store.fetchProfile();
    expect(store.isVerified).toBe(false);
    expect(store.kycBlocked).toBe(false);
    expect(store.profileName).toBe('');
  });
  it('does not retry server-error POST and gives a safe fallback for HTML', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('<html>error</html>', { status: 500 }));
    const { store } = await setup(fetch);
    await expect(store.login('test@example.com', 'password')).rejects.toMatchObject({ status: 500, code: 'http_error' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('does not revive a session when login response arrives after logout', async () => {
    let reply!: (response: Response) => void;
    const fetch = vi.fn().mockImplementation(() => new Promise(resolve => { reply = resolve; }));
    const { store } = await setup(fetch);
    const pending = store.login('test@example.com', 'password').catch(error => error);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    store.logout();
    reply(json(authResponse()));
    await pending;
    expect(store.status).toBe('guest');
    expect(store.token).toBe('');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

});
