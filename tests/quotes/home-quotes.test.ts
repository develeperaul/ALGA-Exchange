import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({
  fetchQuotes: vi.fn(),
  fetchCashRates: vi.fn(),
  isCurrentQuote: (value: { expires_at: string | null }, now = Date.now()) =>
    value.expires_at === null || Date.parse(value.expires_at) > now,
}));

vi.mock('../../src/api/quotes', () => api);
vi.mock('../../src/api/config', () => ({ isMockMode: false }));

const quote = (expiresAt: string) => ({
  quote_id: '11111111-1111-4111-8111-111111111111', type: 'buy' as const, method: 'sbp' as const,
  currency_from: 'RUB' as const, currency_to: 'USDT' as const, rate: '102.00',
  rate_currency: 'RUB' as const, rate_unit: 'USDT' as const, fee_percent: '2.00', expires_at: expiresAt,
});
const cashRate = (expiresAt: string | null = null) => ({
  id: 'cash-1', type: 'rates' as const,
  attributes: { currency_from: 'USDT', currency_to: 'RUB', rate: '90.00', type: 0 as const, expires_at: expiresAt },
});
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  api.fetchQuotes.mockResolvedValue([]);
  api.fetchCashRates.mockResolvedValue([]);
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

async function mountComposable() {
  const [{ mount }, { defineComponent }, { useHomeQuotes }] = await Promise.all([
    import('@vue/test-utils'), import('vue'), import('../../src/composables/useHomeQuotes'),
  ]);
  let state!: ReturnType<typeof useHomeQuotes>;
  const wrapper = mount(defineComponent({ setup() { state = useHomeQuotes(); return () => null; } }));
  return { wrapper, state };
}

describe('home quote lifecycle', () => {
  it('keeps the quote table usable when cash rates fail and represents an empty quote response as empty', async () => {
    api.fetchQuotes.mockResolvedValue([]);
    api.fetchCashRates.mockRejectedValue(new Error('cash unavailable'));
    const { wrapper, state } = await mountComposable();
    await flush();
    expect(state.quotesStatus.value).toBe('ready');
    expect(state.currentQuotes.value).toEqual([]);
    expect(state.cashStatus.value).toBe('error');
    wrapper.unmount();
  });

  it('hides a quote automatically when its expiry passes', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    api.fetchQuotes.mockResolvedValue([quote('2026-10-20T12:00:01Z')]);
    const { wrapper, state } = await mountComposable();
    await flush();
    expect(state.currentQuotes.value).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1250);
    expect(state.currentQuotes.value).toHaveLength(0);
    wrapper.unmount();
  });

  it('rechecks expiries on resume after suspended timers and preserves non-expiring cash rates', async () => {
    const removeWindowListener = vi.spyOn(window, 'removeEventListener');
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    api.fetchQuotes.mockResolvedValue([quote('2026-10-20T12:00:01Z')]);
    api.fetchCashRates.mockResolvedValue([
      cashRate('2026-10-20T12:00:01Z'),
      cashRate(null),
    ]);
    const { wrapper, state } = await mountComposable();
    await flush();
    expect(state.currentQuotes.value).toHaveLength(1);
    expect(state.currentCash.value).toHaveLength(2);

    // Simulate a suspended/backgrounded page: wall time advances while timer callbacks do not run.
    vi.setSystemTime(new Date('2026-10-20T12:00:05Z'));
    expect(state.currentQuotes.value).toHaveLength(1);
    window.dispatchEvent(new Event('focus'));
    await flush();
    expect(state.currentQuotes.value).toHaveLength(0);
    expect(state.currentCash.value).toEqual([cashRate(null)]);

    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(removeWindowListener).toHaveBeenCalledWith('focus', expect.any(Function));
    expect(removeWindowListener).toHaveBeenCalledWith('pageshow', expect.any(Function));
    expect(removeDocumentListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });

  it('supports manual refresh and discards a late response after unmount', async () => {
    let resolveLate!: (items: ReturnType<typeof quote>[]) => void;
    api.fetchQuotes
      .mockResolvedValueOnce([quote('2099-10-20T12:00:00Z')])
      .mockImplementationOnce(() => new Promise(resolve => { resolveLate = resolve; }));
    const { wrapper, state } = await mountComposable();
    await flush();
    expect(state.currentQuotes.value).toHaveLength(1);
    const refresh = state.refreshQuotes();
    expect(state.quotesStatus.value).toBe('loading');
    expect(state.currentQuotes.value).toHaveLength(0);
    wrapper.unmount();
    resolveLate([quote('2099-10-20T12:00:00Z')]);
    await refresh;
    expect(state.currentQuotes.value).toHaveLength(0);
  });
});
