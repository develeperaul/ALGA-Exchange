import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('components/home/HomeActionCard.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/home/HomeExchangeHero.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/home/HomeGreetingHeader.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/home/HomeKycPromoCard.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/home/HomeLimitsPromoCard.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/home/HomeReferralCard.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/kyc/KycStatusCard.vue', () => ({ default: { template: '<div />' } }));
vi.mock('components/kyc/KycStatusModal.vue', () => ({ default: { template: '<div />' } }));
const mockQuotes = vi.hoisted(() => ({ useHomeQuotes: vi.fn() }));
vi.mock('src/composables/useHomeQuotes', () => mockQuotes);

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_API_MODE', 'api');
  vi.stubEnv('VITE_API_BASE_URL', 'https://example.com');
  mockQuotes.useHomeQuotes.mockReturnValue({
    currentQuotes: { value: [
      {
        quote_id: 'buy-sbp-id', type: 'buy', method: 'sbp', currency_from: 'RUB', currency_to: 'USDT',
        rate: '102.000000000000', rate_currency: 'RUB', rate_unit: 'USDT', fee_percent: '2.000000',
        expires_at: '2099-10-16T12:05:00Z',
      },
      {
        quote_id: 'sell-card-id', type: 'sell', method: 'card', currency_from: 'USDT', currency_to: 'RUB',
        rate: '98.031234567890', rate_currency: 'RUB', rate_unit: 'USDT', fee_percent: '2.000000',
        expires_at: '2099-10-16T12:05:00Z',
      },
      {
        quote_id: 'sell-sbp-id', type: 'sell', method: 'sbp', currency_from: 'USDT', currency_to: 'RUB',
        rate: '98.039215686274', rate_currency: 'RUB', rate_unit: 'USDT', fee_percent: '2.000000',
        expires_at: '2099-10-16T12:05:00Z',
      },
    ] },
    currentCash: { value: [] }, quotesStatus: { value: 'ready' }, cashStatus: { value: 'ready' },
    refreshQuotes: vi.fn(), refreshCash: vi.fn(),
  });
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('home API rate presentation', () => {
  it('renders one two-row Figma table, preserves quote precision and exposes sell method selection without movement arrows', async () => {
    const [{ mount, flushPromises }, { createPinia }, { default: IndexPage }, { nextTick }] = await Promise.all([
      import('@vue/test-utils'), import('pinia'), import('../../src/pages/home/IndexPage.vue'),
      import('vue'),
    ]);
    const wrapper = mount(IndexPage, {
      global: {
        plugins: [createPinia()],
        stubs: { 'q-page': { template: '<div><slot /></div>' }, 'q-btn': true },
      },
    });
    await flushPromises();

    const tables = wrapper.findAllComponents({ name: 'HomeRateTable' });
    expect(tables).toHaveLength(1);
    const table = tables[0]!;
    expect(table.text()).toContain('Курс обменов (1 USDT)');
    expect(table.text()).toContain('Покупка');
    expect(table.text()).toContain('Продажа');
    expect(table.findAll('.home-rate-table__row')).toHaveLength(2);
    const items = table.props('items') as Array<Record<string, any>>;
    expect(items.map(item => item.name)).toEqual(['Безналичный', 'Наличный']);
    expect(items[0]).toMatchObject({
      buy: { value: '102 ₽', raw: '102.000000000000', quote: { quote_id: 'buy-sbp-id', fee_percent: '2.000000' } },
      sell: { value: '98,04 ₽', options: [
        { id: 'sell-sbp-id', method: 'СБП', raw: '98.039215686274' },
        { id: 'sell-card-id', method: 'Карта', raw: '98.031234567890' },
      ] },
    });
    expect(table.text()).toContain('98,04 ₽');
    const methodSelect = table.get('select[aria-label="Способ продажи USDT"]');
    expect((methodSelect.element as HTMLSelectElement).value).toBe('sell-sbp-id');
    expect(Array.from((methodSelect.element as HTMLSelectElement).options).map(option => option.text)).toEqual(['СБП', 'Карта']);
    await methodSelect.setValue('sell-card-id');
    await nextTick();
    expect(table.text()).toContain('98,03 ₽');
    expect(table.find('.home-rate-table__value--sell').attributes('title')).toBe('98.031234567890 ₽');

    expect(table.findAll('.home-rate-table__arrow')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('79,8');
    wrapper.unmount();
  });

  it('refreshes only the matching endpoint from empty rows and offers no refresh while loading', async () => {
    const refreshQuotes = vi.fn();
    const refreshCash = vi.fn();
    mockQuotes.useHomeQuotes.mockReturnValue({
      currentQuotes: { value: [] }, currentCash: { value: [] },
      quotesStatus: { value: 'ready' }, cashStatus: { value: 'ready' },
      refreshQuotes, refreshCash,
    });
    const [{ mount, flushPromises }, { createPinia }, { default: IndexPage }] = await Promise.all([
      import('@vue/test-utils'), import('pinia'), import('../../src/pages/home/IndexPage.vue'),
    ]);
    const wrapper = mount(IndexPage, {
      global: { plugins: [createPinia()], stubs: { 'q-page': { template: '<div><slot /></div>' } } },
    });
    await flushPromises();
    const table = wrapper.findComponent({ name: 'HomeRateTable' });
    expect(wrapper.findAllComponents({ name: 'HomeRateTable' })).toHaveLength(1);
    expect(table.findAll('.home-rate-table__retry')).toHaveLength(2);
    await table.findAll('.home-rate-table__retry')[0]!.trigger('click');
    expect(refreshQuotes).toHaveBeenCalledTimes(1);
    expect(refreshCash).not.toHaveBeenCalled();
    await table.findAll('.home-rate-table__retry')[1]!.trigger('click');
    expect(refreshCash).toHaveBeenCalledTimes(1);
    wrapper.unmount();

    mockQuotes.useHomeQuotes.mockReturnValue({
      currentQuotes: { value: [] }, currentCash: { value: [] },
      quotesStatus: { value: 'loading' }, cashStatus: { value: 'loading' },
      refreshQuotes: vi.fn(), refreshCash: vi.fn(),
    });
    const loading = mount(IndexPage, {
      global: { plugins: [createPinia()], stubs: { 'q-page': { template: '<div><slot /></div>' } } },
    });
    await flushPromises();
    expect(loading.findAllComponents({ name: 'HomeRateTable' })).toHaveLength(1);
    expect(loading.find('.home-rate-table__panel').text()).toContain('Загрузка…');
    expect(loading.findAll('.home-rate-table__retry')).toHaveLength(0);
    loading.unmount();
  });
});
