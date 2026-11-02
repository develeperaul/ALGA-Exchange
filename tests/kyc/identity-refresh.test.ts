import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';

const api = vi.hoisted(() => ({
  getOnboarding: vi.fn(), identifyOnboarding: vi.fn(), updateOnboarding: vi.fn(),
  esiaOnboarding: vi.fn(), startOnboarding: vi.fn(), verifyOnboardingPhone: vi.fn(), resendOnboardingOtp: vi.fn(),
}));
vi.mock('@/api/kyc', () => api);
vi.mock('@/api/session', () => ({
  getSessionScope: () => ({ epoch: 1, session: {} }), isCurrentSession: () => true,
  isValidSession: () => true, onSessionChange: () => () => {},
}));
vi.mock('@/stores/auth-store', () => ({ useAuthStore: () => ({ fetchProfile: vi.fn().mockResolvedValue(undefined) }) }));

import ApiKycFlow from '../../src/components/kyc/ApiKycFlow.vue';

const initial = () => ({ state: 'completed', error: null, customer: {
  phone_set: true, kyc_status: 'none', verification_level: 1, identification: null,
} });
let wrapper: ReturnType<typeof mount>;
beforeEach(() => { vi.resetAllMocks(); api.identifyOnboarding.mockResolvedValue({ state: 'queued' }); });
afterEach(() => { wrapper?.unmount(); });
async function openForm() {
  wrapper = mount(ApiKycFlow, { global: { stubs: {
    KycStepLayout: { template: '<div><slot /></div>' }, RouterLink: true,
  } } });
  await flushPromises();
  for (const [name, value] of Object.entries({
    'onboarding-last-name': 'Тестовый', 'onboarding-first-name': 'Тест',
    'onboarding-birth-date': '1990-01-01', 'onboarding-document': '0000 000000',
  })) await wrapper.find(`input[name="${name}"]`).setValue(value);
  await flushPromises();
}
describe('KYC identity state reconciliation', () => {
  it('reads the new state after one successful submission and hides the form while checking', async () => {
    api.getOnboarding.mockResolvedValueOnce(initial()).mockResolvedValueOnce({ ...initial(), customer: {
      ...initial().customer, kyc_status: 'pending', identification: { state: 'checking', action: 'identify', error: null },
    } });
    await openForm();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(api.identifyOnboarding).toHaveBeenCalledTimes(1);
    expect(api.getOnboarding).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('Состояние проверки обновлено');
    expect(wrapper.text()).toContain('Проверяем данные');
    expect(wrapper.find('form').exists()).toBe(false);
  });
  it('retries only GET when the submission succeeded but reading its state failed', async () => {
    api.getOnboarding.mockResolvedValueOnce(initial()).mockRejectedValueOnce(new Error('Сервис недоступен'))
      .mockResolvedValueOnce(initial());
    await openForm();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.text()).toContain('Данные отправлены, но не удалось обновить состояние');
    expect(api.identifyOnboarding).toHaveBeenCalledTimes(1);
    await wrapper.findAll('button').find(button => button.text() === 'Обновить состояние')!.trigger('click');
    await flushPromises();
    expect(api.getOnboarding).toHaveBeenCalledTimes(3);
    expect(api.identifyOnboarding).toHaveBeenCalledTimes(1);
  });
});
