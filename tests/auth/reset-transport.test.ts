import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const json = (body: unknown) => new Response(JSON.stringify(body), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_MODE', 'api');
  vi.stubEnv('VITE_API_BASE_URL', 'https://example.com');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('reset password API adapters', () => {
  it('sends the three public reset requests with their documented payloads and no bearer token', async () => {
    const requests: Array<{ path: string; payload: unknown; request: Request }> = [];
    const fetch = vi.fn()
      .mockImplementationOnce(async (request: Request) => {
        requests.push({ path: new URL(request.url).pathname, payload: await request.clone().json(), request });
        return json({ data: { status: 'ok' } });
      })
      .mockImplementationOnce(async (request: Request) => {
        requests.push({ path: new URL(request.url).pathname, payload: await request.clone().json(), request });
        return json({ data: { token: 'one-time-proof' } });
      })
      .mockImplementationOnce(async (request: Request) => {
        requests.push({ path: new URL(request.url).pathname, payload: await request.clone().json(), request });
        return json({ data: { token: 'session-token', expires_at: null } });
      });
    vi.stubGlobal('fetch', fetch);
    const auth = await import('../../src/api/auth');

    await auth.sendResetPasswordCode({ email: 'qa@example.com' });
    await auth.checkResetPasswordCode({ email: 'qa@example.com', code: '123456' });
    await auth.setResetPasswordPassword({ token: 'one-time-proof', password: 'test-only-password' });

    expect(requests.map(({ path, payload }) => [path, payload])).toEqual([
      ['/api/auth/reset-passwords/codes', { email: 'qa@example.com' }],
      ['/api/auth/reset-passwords/codes/check', { email: 'qa@example.com', code: '123456' }],
      ['/api/auth/reset-passwords', { token: 'one-time-proof', password: 'test-only-password' }],
    ]);
    for (const { request } of requests) {
      expect(request.method).toBe('POST');
      expect(request.headers.get('Accept')).toContain('json');
      expect(request.headers.get('Content-Type')).toContain('json');
      expect(request.credentials).toBe('omit');
      expect(request.headers.has('Authorization')).toBe(false);
    }
  });

  it('does not retry failed reset POST requests', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ errors: [{ status: '429', code: 'rate_limited', message: 'Try later' }] }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '45' },
    }));
    vi.stubGlobal('fetch', fetch);
    const auth = await import('../../src/api/auth');

    await expect(auth.sendResetPasswordCode({ email: 'qa@example.com' }))
      .rejects.toMatchObject({ status: 429, code: 'rate_limited' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
