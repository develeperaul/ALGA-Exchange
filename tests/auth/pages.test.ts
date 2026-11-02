import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { reactive } from 'vue';
import { ApiError } from '../../src/api/errors';

const { router, auth } = vi.hoisted(() => ({ router: { push: vi.fn(), back: vi.fn(), options: { history: { state: {} } } }, auth: {
  email: '', token: '', status: 'guest', isAuthenticated: false,
  sendRegisterCode: vi.fn(), resumeRegistration: vi.fn(), checkRegisterCode: vi.fn(), setRegisterPassword: vi.fn(), resetRegistration: vi.fn(), setRegistrationEmail: vi.fn(), fetchProfile: vi.fn(), login: vi.fn(), cancelLogin: vi.fn(),
} }));
vi.mock('vue-router', () => ({ useRouter: () => router }));
vi.mock('stores/auth-store', () => ({ useAuthStore: () => reactive(auth) }));

import RegPage from '../../src/pages/auth/RegPage.vue';
import AuthPage from '../../src/pages/auth/AuthPage.vue';
import UiIcon from '../../src/components/ui/UiIcon.vue';
const mountPage = (page: typeof RegPage | typeof AuthPage) => mount(page, { global: { components: { UiIcon } } });

const input = (name: string) => `[name="${name}"]`;
async function type(wrapper: ReturnType<typeof mount>, name: string, value: string) {
  await wrapper.find(input(name)).setValue(value);
}
async function acceptTerms(wrapper: ReturnType<typeof mount>) {
  const checks = wrapper.findAll('input[type="checkbox"]');
  await checks[0].setValue(true); await checks[1].setValue(true);
}
beforeEach(() => {
  setActivePinia(createPinia());
  Object.assign(auth, { email: '', token: '', status: 'guest', isAuthenticated: false });
  for (const action of [auth.sendRegisterCode, auth.resumeRegistration, auth.checkRegisterCode, auth.setRegisterPassword, auth.resetRegistration, auth.setRegistrationEmail, auth.fetchProfile, auth.login, auth.cancelLogin]) action.mockReset();
  router.push.mockReset(); router.back.mockReset();
});
afterEach(() => vi.clearAllTimers());

describe('registration page', () => {
  it('requires valid email and both consent choices; advances only after send succeeds', async () => {
    auth.sendRegisterCode.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
    const wrapper = mountPage(RegPage);
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await type(wrapper, 'auth-email', 'qa@example.com'); await acceptTerms(wrapper);
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Регистрация');
    expect(wrapper.get('[role="alert"]').exists()).toBe(true);
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.sendRegisterCode).toHaveBeenCalledTimes(2);
    expect(wrapper.find('h1').text()).toBe('Введите код');
    expect(wrapper.text()).toContain('qa@example.com');
    wrapper.unmount();
  });

  it('blocks initial code-send retries during Retry-After, including after back navigation', async () => {
    const rateLimit = new ApiError('Try later', 429, 'rate_limited', [], '60');
    auth.sendRegisterCode.mockRejectedValue(rateLimit);
    const wrapper = mountPage(RegPage);
    await type(wrapper, 'auth-email', 'qa@example.com'); await acceptTerms(wrapper);
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.sendRegisterCode).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toMatch(/60/);
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.sendRegisterCode).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('blocks repeated verification after a 429 rather than retrying or resending immediately', async () => {
    auth.resumeRegistration.mockResolvedValue(undefined);
    auth.checkRegisterCode.mockRejectedValue(new ApiError('Too many attempts', 429, 'rate_limited', [], '45'));
    const wrapper = mountPage(RegPage);
    await type(wrapper, 'auth-email', 'qa@example.com');
    await wrapper.findAll('button').find(button => button.text().includes('У меня уже есть код'))!.trigger('click'); await flushPromises();
    await type(wrapper, 'auth-code', '123456'); await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.checkRegisterCode).toHaveBeenCalledTimes(1);
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.checkRegisterCode).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toMatch(/45/);
    wrapper.unmount();
  });

  it('keeps resend Retry-After active when backing to the email step', async () => {
    auth.sendRegisterCode.mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new ApiError('Try later', 429, 'rate_limited', [], '45'));
    const wrapper = mountPage(RegPage);
    await type(wrapper, 'auth-email', 'qa@example.com'); await acceptTerms(wrapper);
    await wrapper.find('form').trigger('submit'); await flushPromises();
    await wrapper.find('.auth-screen__resend').trigger('click'); await flushPromises();
    expect(auth.sendRegisterCode).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.auth-screen__resend').attributes('disabled')).toBeDefined();
    await wrapper.find('button[aria-label="Назад"]').trigger('click');
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Регистрация');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.sendRegisterCode).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it('does not advance on failed code verification and enforces password length and match', async () => {
    auth.sendRegisterCode.mockResolvedValue(undefined);
    auth.checkRegisterCode.mockRejectedValueOnce(new Error('bad code')).mockResolvedValueOnce(undefined);
    const wrapper = mountPage(RegPage);
    await type(wrapper, 'auth-email', 'qa@example.com'); await acceptTerms(wrapper); await wrapper.find('form').trigger('submit'); await flushPromises();
    await type(wrapper, 'auth-code', '123456'); await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Введите код');
    expect(wrapper.get('[role="alert"]').exists()).toBe(true);
    await wrapper.find('.auth-screen__resend').trigger('click'); await flushPromises();
    await type(wrapper, 'auth-code', '123456'); await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.find('h1').text()).toContain('Придумайте пароль');
    await type(wrapper, 'auth-password', '12345'); await type(wrapper, 'auth-password-repeat', '12345');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await type(wrapper, 'auth-password', '123456');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await type(wrapper, 'auth-password-repeat', '123456');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    wrapper.unmount();
  });

  it('resumes with an existing code without sending email and requires fresh consent before password completion', async () => {
    auth.resumeRegistration.mockResolvedValue(undefined);
    auth.checkRegisterCode.mockResolvedValue(undefined);
    auth.setRegisterPassword.mockResolvedValue(undefined);
    const wrapper = mountPage(RegPage);
    await type(wrapper, 'auth-email', 'qa@example.com');
    const resume = wrapper.findAll('button').find(button => button.text().includes('У меня уже есть код'));
    expect(resume, 'email step should offer the existing-code path').toBeDefined();
    await resume!.trigger('click'); await flushPromises();
    expect(auth.resumeRegistration).toHaveBeenCalledWith('qa@example.com');
    expect(auth.sendRegisterCode).not.toHaveBeenCalled();
    await type(wrapper, 'auth-code', '123456'); await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.checkRegisterCode).toHaveBeenCalledWith('123456');
    await type(wrapper, 'auth-password', 'test-only-password');
    await type(wrapper, 'auth-password-repeat', 'test-only-password');
    const finalButton = wrapper.find('button[type="submit"]');
    expect(finalButton.attributes('disabled')).toBeDefined();
    expect(wrapper.findAll('input[type="checkbox"]').every(check => !(check.element as HTMLInputElement).checked)).toBe(true);
    await acceptTerms(wrapper);
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.setRegisterPassword).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});

describe('login page', () => {
  it('renders action failures inline and does not navigate', async () => {
    auth.login.mockRejectedValue(new Error('offline'));
    const wrapper = mountPage(AuthPage);
    await type(wrapper, 'login-email', 'qa@example.com'); await type(wrapper, 'login-password', 'test-only-password');
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toContain('Не удалось выполнить запрос');
    expect(router.push).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('shows profile recovery and retries profile without submitting login again', async () => {
    auth.token = 'test-session'; auth.status = 'error';
    auth.fetchProfile.mockResolvedValue(undefined);
    const wrapper = mountPage(AuthPage);
    expect(wrapper.find('[aria-label="Загрузка профиля"]').exists()).toBe(true);
    await wrapper.find('button.auth-screen__button').trigger('click'); await flushPromises();
    expect(auth.login).not.toHaveBeenCalled();
    expect(auth.fetchProfile).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it.each(['unauthorized', 'expired'])('returns to a usable login form after login 503 and profile recovery loses session (%s)', async reason => {
    auth.login.mockImplementationOnce(() => {
      const reactiveStore = reactive(auth);
      reactiveStore.token = 'saved-session'; reactiveStore.status = 'error';
      return Promise.reject(new ApiError('Profile unavailable', 503, 'http_error'));
    });
    auth.fetchProfile.mockImplementationOnce(() => {
      const reactiveStore = reactive(auth);
      reactiveStore.token = ''; reactiveStore.status = 'guest';
      if (reason === 'expired') return Promise.resolve(null);
      return Promise.reject(new ApiError('Unauthorized', 401, 'unauthorized'));
    });
    const wrapper = mountPage(AuthPage);
    await type(wrapper, 'login-email', 'qa@example.com'); await type(wrapper, 'login-password', 'test-only-password');
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(wrapper.find('[aria-label="Загрузка профиля"]').exists()).toBe(true);
    await wrapper.find('button.auth-screen__button').trigger('click'); await flushPromises();
    expect(wrapper.find(input('login-email')).exists()).toBe(true);
    expect(wrapper.find('[aria-label="Загрузка профиля"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('cancels an in-flight login when the page unmounts', async () => {
    let resolveLogin!: () => void;
    auth.login.mockImplementation(() => new Promise<void>(resolve => { resolveLogin = resolve; }));
    const wrapper = mountPage(AuthPage);
    await type(wrapper, 'login-email', 'qa@example.com'); await type(wrapper, 'login-password', 'test-only-password');
    await wrapper.find('form').trigger('submit');
    wrapper.unmount();
    expect(auth.cancelLogin).toHaveBeenCalledTimes(1);
    resolveLogin();
    await flushPromises();
    expect(router.push).not.toHaveBeenCalled();
  });
});
