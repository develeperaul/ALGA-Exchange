import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_MODE', 'api');
  vi.stubEnv('VITE_API_BASE_URL', 'https://example.com');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('API transport contract', () => {
  it('serializes login and registration payloads to the documented API paths', async () => {
    const fetch = vi.fn()
      .mockImplementationOnce(() => Promise.resolve(json({ data: { token: 'code-proof' } })))
      .mockImplementation(() => Promise.resolve(json({ data: { status: 'ok' } })));
    vi.stubGlobal('fetch', fetch);
    const auth = await import('../../src/api/auth');
    await auth.login({ email: 'qa@example.com', password: 'test-only-password' });
    await auth.sendRegisterCode({ email: 'qa@example.com' });
    await auth.checkRegisterCode({ email: 'qa@example.com', code: '123456' });
    await auth.setRegisterPassword({ token: 'code-proof', password: 'test-only-password' });
    expect(fetch.mock.calls.map(([request]) => new URL(request.url).pathname)).toEqual([
      '/api/auth/login', '/api/auth/register/codes', '/api/auth/register/codes/check', '/api/auth/register/passwords',
    ]);
    for (const [request] of fetch.mock.calls) {
      expect(request.headers.get('Accept')).toContain('application/json');
      expect(request.headers.get('Content-Type')).toContain('application/json');
      expect(request.credentials).toBe('omit');
      expect(request.headers.has('Authorization')).toBe(false);
    }
  });

  it.each([
    ['422 HTML', () => new Response('<html>bad</html>', { status: 422 }), 422, 'http_error'],
    ['500 empty body', () => new Response(null, { status: 500 }), 500, 'http_error'],
  ])('normalizes %s into a safe error', async (_label, response, status, code) => {
    const fetch = vi.fn().mockResolvedValue(response());
    vi.stubGlobal('fetch', fetch);
    const { requestJson } = await import('../../src/api/client');
    await expect(requestJson('api/auth/register/codes', { method: 'post', json: { email: 'qa@example.com' } }))
      .rejects.toMatchObject({ status, code, message: expect.any(String) });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('keeps structured JSON:API validation errors and Retry-After', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ errors: [{ code: 'email_taken', message: 'Почта занята' }] }, 429, { 'Retry-After': '17' }));
    vi.stubGlobal('fetch', fetch);
    const { requestJson } = await import('../../src/api/client');
    await expect(requestJson('api/auth/register/codes', { method: 'post', json: { email: 'qa@example.com' } }))
      .rejects.toMatchObject({ status: 429, code: 'email_taken', message: 'Почта занята', retryAfter: '17', errors: [{ code: 'email_taken' }] });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('rejects malformed success JSON with invalid_response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{broken', { status: 200, headers: { 'Content-Type': 'application/json' } })));
    const { requestJson } = await import('../../src/api/client');
    await expect(requestJson('api/auth/register/codes')).rejects.toMatchObject({ code: 'invalid_response' });
  });

});
