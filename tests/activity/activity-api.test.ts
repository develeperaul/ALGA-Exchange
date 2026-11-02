// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key), clear: () => values.clear() };
}
const storage = { localStorage: memoryStorage(), sessionStorage: memoryStorage() };
vi.stubGlobal('window', storage);
vi.stubGlobal('localStorage', storage.localStorage);
vi.stubGlobal('sessionStorage', storage.sessionStorage);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const transaction = (status = 2) => ({ id: '21', type: 'transactions', attributes: {
  type: 0, status, method: 1, currency_from: 'RUB', currency_to: 'USDT', amount_from: null,
  amount_to: '12.123456', fee_amount: null, fee_currency: 'RUB', created_at: '2026-10-30T08:00:00Z',
  completed_at: null, error_code: null, details: { payment_link: 'https://payments.example.com/pay' },
} });
beforeEach(() => { vi.resetModules(); vi.stubEnv('VITE_API_MODE', 'api'); vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com'); });
afterEach(() => { vi.unstubAllEnvs(); });
async function setup(fetch: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetch);
  const session = await import('../../src/api/session');
  session.replaceSession({ token: 'test-session-only', expires_at: null });
  return import('../../src/api/activity');
}
describe('authenticated activity reads', () => {
  it('preserves decimal strings/null amounts and uses server status, not completed_at', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ data: [transaction(8)], links: { next: null } }));
    const api = await setup(fetch);
    const result = await api.fetchHistory('transactions', 'completed');
    expect(result.items[0].attributes).toMatchObject({ amount_from: null, amount_to: '12.123456', status: 8 });
    const request = fetch.mock.calls[0][0] as Request;
    expect(request.method).toBe('GET'); expect(request.cache).toBe('no-store');
    expect(request.headers.get('Authorization')).toBe('Bearer test-session-only');
    const params = new URL(request.url).searchParams;
    expect(params.getAll('filter[status][]')).toContain('8');
    expect(params.getAll('filter[status][]')).not.toContain('1');
  });
  it('uses pagination query only and never sends bearer to a host from next links', async () => {
    const fetch = vi.fn().mockImplementation(async () => json({ data: [], links: { next: 'https://untrusted.example/api/transactions?page%5Bnumber%5D=2&filter%5Bstatus%5D%5B%5D=2' } }));
    const api = await setup(fetch);
    const first = await api.fetchHistory('transactions', 'active');
    await api.fetchHistory('transactions', 'active', first.next!);
    const request = fetch.mock.calls[1][0] as Request;
    expect(new URL(request.url).origin).toBe('https://api.example.com');
    expect(new URL(request.url).searchParams.get('page[number]')).toBe('2');
    expect(new URL(request.url).searchParams.getAll('filter[status][]')).not.toContain('2');
  });
  it('rejects a next link to a different endpoint and invalid detail IDs before requesting', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ data: [], links: { next: 'https://api.example.com/api/profile/me?page=2' } }));
    const api = await setup(fetch);
    await expect(api.fetchHistory('cash')).rejects.toMatchObject({ code: 'invalid_response' });
    await expect(api.fetchOrder('cash', '../profile')).rejects.toMatchObject({ code: 'invalid_response' });
    await expect(api.fetchReferralEntry('numeric-123')).rejects.toMatchObject({ code: 'invalid_response' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('keeps old referral currency unknown and avoids the unsupported type filter', async () => {
    const entry = { id: '11111111-1111-4111-8111-111111111111', type: 'referral_transactions', attributes: {
      kind: 'legacy', currency: null, amount: '25.00', type: 1, state: null, status: 1,
      created_at: '2026-10-30T08:00:00Z', credited_amount: null, repaid_amount: null, debt_amount: null,
      settled_at: null, cancelled_at: null, referred: null,
    } };
    const fetch = vi.fn().mockResolvedValue(json({ data: [entry], links: { next: null } }));
    const api = await setup(fetch);
    const result = await api.fetchReferralHistory();
    expect(result.items[0].attributes.currency).toBeNull();
    expect(new URL(fetch.mock.calls[0][0].url).searchParams.has('filter[type][]')).toBe(false);
  });
  it('does not turn a referral failure or malformed response into a zero balance', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ errors: [{ code: 'unavailable', message: 'Временно недоступно' }] }, 500))
      .mockResolvedValueOnce(json({ data: { currency: 'USDT', available: 0, reserved: '0.000000', total: '0.000000', is_frozen: false } }));
    const api = await setup(fetch);
    await expect(api.fetchReferralProfile()).rejects.toMatchObject({ status: 500 });
    await expect(api.fetchBalance()).rejects.toMatchObject({ code: 'invalid_response' });
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it('uses earned reward fields without adding them to available balance or treating them as turnover', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(json({ data: { id: 'r1', type: 'referral', attributes: {
      code: 'INVITE-CODE', currency: 'USDT', earned_amount: '12.123456', pending_amount: '3.000000',
      cancelled_amount: '1.000000', repaid_amount: '2.000000', debt_amount: '4.000000',
    } } })).mockResolvedValueOnce(json({ data: [], meta: { total: 0 } }));
    const api = await setup(fetch);
    expect((await api.fetchReferralProfile()).attributes.earned_amount).toBe('12.123456');
    expect(await api.fetchRelations()).toEqual({ items: [], total: 0 });
  });
  it('accepts current production referral balance/program without inventing omitted debt statistics', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ data: { id: 'r2', type: 'referral', attributes: {
      code: 'TEST-INVITE', currency: 'USDT', earned_amount: '4.123456', pending_amount: '1.000000', cancelled_amount: '0.000000',
      balance: { currency: 'USDT', network: 'TRON', available: '4.123456', reserved: '0.000000', total: '4.123456',
        pending_rewards: '1.000000', minimum_withdrawal: '10.000000', withdrawal_fee: '1.000000', kyc_verified: false, is_frozen: false },
      program: { value: '25.00', basis: 'merchant_commission', enabled: true, levels: { first: '25.00', second: null } },
    } } }));
    const api = await setup(fetch);
    const result = await api.fetchReferralProfile();
    expect(result.attributes.balance?.available).toBe('4.123456');
    expect(result.attributes.program?.value).toBe('25.00');
    expect(result.attributes.debt_amount).toBeUndefined();
  });
});
