import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const quote = (overrides: Record<string, unknown> = {}) => ({
  quote_id: '11111111-1111-4111-8111-111111111111',
  type: 'buy',
  method: 'sbp',
  currency_from: 'RUB',
  currency_to: 'USDT',
  rate: '102.000000000000',
  rate_currency: 'RUB',
  rate_unit: 'USDT',
  fee_percent: '2.000000',
  expires_at: '2099-10-16T12:05:00Z',
  ...overrides,
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_MODE', 'api');
  vi.stubEnv('VITE_API_BASE_URL', 'https://example.com');
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('shared quotes API', () => {
  it('does a public, unfiltered, no-store GET without amount or bearer credentials', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ data: [quote()] }));
    vi.stubGlobal('fetch', fetch);
    const { SESSION_STORAGE_KEY } = await import('../../src/api/session');
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: 'test-token', expires_at: null }));

    const { fetchQuotes } = await import('../../src/api/quotes');
    await fetchQuotes();

    expect(fetch).toHaveBeenCalledTimes(1);
    const [request] = fetch.mock.calls[0] as [Request];
    const url = new URL(request.url);
    expect(url.pathname).toBe('/api/quotes');
    expect(url.search).toBe('');
    expect(request.method).toBe('GET');
    expect(request.cache).toBe('no-store');
    expect(request.headers.has('Authorization')).toBe(false);
  });

  it('preserves API rates as already fee-inclusive for both buy and sell directions', async () => {
    const buy = quote();
    const sell = quote({
      quote_id: '22222222-2222-4222-8222-222222222222', type: 'sell', method: 'card',
      currency_from: 'USDT', currency_to: 'RUB', rate: '98.039215686274',
    });
    const sellSbp = quote({
      quote_id: '33333333-3333-4333-8333-333333333333', type: 'sell', method: 'sbp',
      currency_from: 'USDT', currency_to: 'RUB', rate: '98.039215686274',
    });
    const fetch = vi.fn().mockResolvedValue(json({ data: [buy, sell, sellSbp] }));
    vi.stubGlobal('fetch', fetch);

    const { fetchQuotes } = await import('../../src/api/quotes');
    const result = await fetchQuotes();

    expect(result.map(({ type, method, rate, fee_percent }) => ({ type, method, rate, fee_percent }))).toEqual([
      { type: 'buy', method: 'sbp', rate: '102.000000000000', fee_percent: '2.000000' },
      { type: 'sell', method: 'card', rate: '98.039215686274', fee_percent: '2.000000' },
      { type: 'sell', method: 'sbp', rate: '98.039215686274', fee_percent: '2.000000' },
    ]);
    // The client-visible rate is already final: adding the 2% fee again would yield 104.04 / 96.0784.
    expect(Number(result[0].rate) * (1 + Number(result[0].fee_percent) / 100)).not.toBe(Number(result[0].rate));
  });

  it('accepts an empty data list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ data: [] })));
    const { fetchQuotes } = await import('../../src/api/quotes');
    await expect(fetchQuotes()).resolves.toEqual([]);
  });

  it.each([
    ['missing data', {}],
    ['malformed record', { data: [{ ...quote(), rate: 'not-a-rate' }] }],
    ['unsupported buy method', { data: [quote({ method: 'card' })] }],
  ])('rejects %s instead of accepting an invalid rate', async (_label, payload) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(payload)));
    const { fetchQuotes } = await import('../../src/api/quotes');
    await expect(fetchQuotes()).rejects.toMatchObject({ code: 'invalid_response' });
  });

  it('surfaces an API failure without replacing it with a fabricated quote', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ errors: [{ code: 'unavailable' }] }, 503)));
    const { fetchQuotes } = await import('../../src/api/quotes');
    await expect(fetchQuotes()).rejects.toMatchObject({ status: 503 });
  });

  it('treats expired quotes as stale and keeps future quotes current', async () => {
    const { isCurrentQuote } = await import('../../src/api/quotes');
    const now = Date.parse('2026-10-20T12:00:00Z');
    expect(isCurrentQuote({ expires_at: '2026-10-20T11:59:59Z' }, now)).toBe(false);
    expect(isCurrentQuote({ expires_at: '2026-10-20T12:00:01Z' }, now)).toBe(true);
  });
});

describe('home rate table', () => {
  it('keeps the title, columns, and single panel during loading, error, and empty data states', async () => {
    const { mount } = await import('@vue/test-utils');
    const { default: HomeRateTable } = await import('../../src/components/home/HomeRateTable.vue');
    const states = [
      { label: 'Загрузка…', status: 'loading' as const, retry: undefined, buttonLabel: undefined },
      { label: 'Ошибка курса', status: 'error' as const, retry: 'quotes' as const, buttonLabel: 'Повторить' },
      { label: 'Нет курса', status: 'ready' as const, retry: 'cash' as const, buttonLabel: 'Обновить' },
    ];
    for (const state of states) {
      const wrapper = mount(HomeRateTable, { props: { items: [
        { name: 'Безналичный', buy: { value: '—' }, sell: { value: '—' }, notice: state.label, status: state.status, retry: state.retry },
        { name: 'Наличный', buy: { value: '—' }, sell: { value: '—' }, notice: 'Нет курса' },
      ] } });
      expect(wrapper.text()).toContain('Курс обменов (1 USDT)');
      expect(wrapper.text()).toContain('Покупка');
      expect(wrapper.text()).toContain('Продажа');
      expect(wrapper.findAll('.home-rate-table__panel')).toHaveLength(1);
      expect(wrapper.findAll('.home-rate-table__row')).toHaveLength(2);
      expect(wrapper.text()).toContain(state.label);
      if (state.retry) {
        const retry = wrapper.get('.home-rate-table__retry');
        expect(retry.text()).toBe(state.buttonLabel);
        expect(retry.element.tagName).toBe('BUTTON');
        await retry.trigger('click');
        expect(wrapper.emitted('refresh')).toEqual([[state.retry]]);
      } else {
        expect(wrapper.find('.home-rate-table__retry').exists()).toBe(false);
      }
      expect(wrapper.text()).not.toContain('79,8');
      wrapper.unmount();
    }
  });

  it('keeps the selected sell method aligned with the displayed rate when quotes refresh', async () => {
    const { mount } = await import('@vue/test-utils');
    const { default: HomeRateTable } = await import('../../src/components/home/HomeRateTable.vue');
    const wrapper = mount(HomeRateTable, { props: { items: [{
      name: 'Безналичный', buy: { value: '—' },
      sell: { value: '98,04 ₽', options: [
        { id: 'sbp-old', method: 'СБП', value: '98,04 ₽', raw: '98.039215686274' },
        { id: 'card-old', method: 'Карта', value: '98,03 ₽', raw: '98.031234567890' },
      ] },
    }] } });
    const select = () => wrapper.get('select[aria-label="Способ продажи USDT"]');
    expect((select().element as HTMLSelectElement).value).toBe('sbp-old');
    await select().setValue('card-old');
    expect(wrapper.find('.home-rate-table__value--sell').text()).toContain('98,03 ₽');

    await wrapper.setProps({ items: [{
      name: 'Безналичный', buy: { value: '—' },
      sell: { value: '97,5 ₽', options: [
        { id: 'sbp-new', method: 'СБП', value: '97,5 ₽', raw: '97.500000000000' },
        { id: 'card-new', method: 'Карта', value: '96,75 ₽', raw: '96.750000000000' },
      ] },
    }] });
    expect((select().element as HTMLSelectElement).value).toBe('sbp-new');
    expect(wrapper.find('.home-rate-table__value--sell').text()).toContain('97,5 ₽');
    expect(wrapper.find('.home-rate-table__value--sell').attributes('title')).toBe('97.500000000000 ₽');
    wrapper.unmount();
  });
});

describe('mock mode boundary', () => {
  it('does not fetch API quotes or rates when the legacy mock mode is enabled', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_API_MODE', 'mock');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const { mount } = await import('@vue/test-utils');
    const { defineComponent } = await import('vue');
    const { useHomeQuotes } = await import('../../src/composables/useHomeQuotes');
    const wrapper = mount(defineComponent({ setup() { useHomeQuotes(); return () => null; } }));
    await Promise.resolve();
    expect(fetch).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
