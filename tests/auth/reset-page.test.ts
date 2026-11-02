import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
import { ApiError } from '../../src/api/errors';

const { router, auth } = vi.hoisted(() => ({ router: { push: vi.fn(), replace: vi.fn(), back: vi.fn() }, auth: {
  resetEmail: '', resetCodeSent: false, resetVerificationToken: '',
  sendResetCode: vi.fn(), checkResetCode: vi.fn(), setResetPassword: vi.fn(), resetPasswordFlow: vi.fn(),
} }));
vi.mock('vue-router', () => ({ useRouter: () => router }));
vi.mock('stores/auth-store', () => ({ useAuthStore: () => reactive(auth) }));

import ResetPage from '../../src/pages/auth/ResetPage.vue';
import UiIcon from '../../src/components/ui/UiIcon.vue';
const mountPage = () => mount(ResetPage, { global: { components: { UiIcon } } });
const field = (name: string) => `[name="${name}"]`;
async function type(wrapper: ReturnType<typeof mount>, name: string, value: string) { await wrapper.find(field(name)).setValue(value); }
async function emailStep(wrapper: ReturnType<typeof mount>) {
  await type(wrapper, 'auth-email', ' QA@Example.com ');
  await wrapper.find('form').trigger('submit'); await flushPromises();
}
beforeEach(() => {
  Object.assign(auth, { resetEmail: '', resetCodeSent: false, resetVerificationToken: '' });
  for (const action of [auth.sendResetCode, auth.checkResetCode, auth.setResetPassword, auth.resetPasswordFlow]) action.mockReset();
  router.push.mockReset(); router.replace.mockReset(); router.back.mockReset();
});
afterEach(() => { vi.clearAllTimers(); });

describe('password reset page', () => {
  it('validates email and code before advancing and normalizes the email', async () => {
    auth.sendResetCode.mockImplementation(async () => { auth.resetCodeSent = true; });
    auth.checkResetCode.mockImplementation(async () => { auth.resetVerificationToken = 'proof'; });
    const wrapper = mountPage();
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await emailStep(wrapper);
    expect(auth.sendResetCode).toHaveBeenCalledWith('qa@example.com');
    expect(wrapper.find('h1').text()).toBe('Введите код');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await type(wrapper, 'auth-code', '123456');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    await wrapper.find('form').trigger('submit'); await flushPromises();
    expect(auth.checkResetCode).toHaveBeenCalledWith('123456');
    expect(wrapper.find('h1').text()).toBe('Придумайте новый пароль');
    wrapper.unmount();
  });

  it('applies Retry-After to resend and does not submit while cooldown is active', async () => {
    auth.sendResetCode.mockImplementationOnce(async () => { auth.resetCodeSent = true; })
      .mockRejectedValueOnce(new ApiError('Try later', 429, 'rate_limited', [], '45'));
    const wrapper = mountPage();
    await emailStep(wrapper);
    await wrapper.find('.auth-screen__resend').trigger('click'); await flushPromises();
    expect(auth.sendResetCode).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.auth-screen__resend').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toMatch(/45/);
    await wrapper.find('.auth-screen__resend').trigger('click'); await flushPromises();
    expect(auth.sendResetCode).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it('enforces password length and match, then clears flow on unmount while a request is pending', async () => {
    auth.sendResetCode.mockImplementation(async () => { auth.resetCodeSent = true; });
    auth.checkResetCode.mockImplementation(async () => { auth.resetVerificationToken = 'proof'; });
    let resolvePassword!: () => void;
    auth.setResetPassword.mockImplementation(() => new Promise<void>(resolve => { resolvePassword = resolve; }));
    const wrapper = mountPage();
    await emailStep(wrapper);
    await type(wrapper, 'auth-code', '123456'); await wrapper.find('form').trigger('submit'); await flushPromises();
    await type(wrapper, 'auth-password', '12345'); await type(wrapper, 'auth-password-repeat', '12345');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await type(wrapper, 'auth-password', 'test-only-password');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
    await type(wrapper, 'auth-password-repeat', 'test-only-password');
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    await wrapper.find('form').trigger('submit');
    expect(auth.setResetPassword).toHaveBeenCalledWith('test-only-password');
    wrapper.unmount();
    expect(auth.resetPasswordFlow).toHaveBeenCalled();
    resolvePassword(); await flushPromises();
    expect(router.replace).not.toHaveBeenCalled();
  });
});
