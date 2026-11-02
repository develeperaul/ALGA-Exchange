import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';

const { router, auth } = vi.hoisted(() => ({ router: { push: vi.fn(), replace: vi.fn(), back: vi.fn() }, auth: {
  status: 'guest', token: '', isAuthenticated: false, profile: null as null | { email: string },
  profileEmail: '', profilePhone: '', verificationStatus: 'unverified', isVerified: false,
  fetchProfile: vi.fn(), logout: vi.fn(),
} }));
vi.mock('vue-router', () => ({ useRouter: () => router }));
vi.mock('stores/auth-store', () => ({ useAuthStore: () => reactive(auth) }));
vi.mock('@/api/config', () => ({ isMockMode: false }));

import ProfilePage from '../../src/pages/profile/ProfilePage.vue';
import UiButton from '../../src/components/ui/UiButton.vue';
const mountPage = () => mount(ProfilePage, { global: {
  components: { UiButton },
  stubs: { 'q-page': { template: '<div><slot /></div>' }, ProfileMenuRow: true },
} });
beforeEach(() => {
  Object.assign(auth, { status: 'guest', token: '', isAuthenticated: false, profile: null,
    profileEmail: '', profilePhone: '', verificationStatus: 'unverified', isVerified: false });
  auth.fetchProfile.mockReset(); auth.logout.mockReset(); router.push.mockReset(); router.replace.mockReset();
});
afterEach(() => { vi.clearAllTimers(); });

describe('profile page auth states', () => {
  it('shows guest sign-in, restoring status, and error retry states', async () => {
    const guest = mountPage();
    expect(guest.text()).toContain('Войти/авторизоваться');
    guest.unmount();

    auth.status = 'restoring';
    const restoring = mountPage();
    expect(restoring.get('[role="status"]').text()).toContain('Загрузка профиля');
    restoring.unmount();

    auth.status = 'error'; auth.token = 'saved-session';
    auth.fetchProfile.mockImplementation(async () => {
      const state = reactive(auth);
      state.profile = { email: 'qa@example.com' }; state.status = 'authenticated'; state.isAuthenticated = true;
    });
    const failed = mountPage();
    expect(failed.get('[role="alert"]').text()).toContain('Не удалось загрузить профиль');
    await failed.findAll('button').find(button => button.text() === 'Повторить')!.trigger('click');
    await flushPromises();
    expect(auth.fetchProfile).toHaveBeenCalledTimes(1);
    expect(failed.text()).toContain('qa@example.com');
    failed.unmount();
  });

  it('shows approved provider status without nullable phone or mock KYC action, and logs out', async () => {
    auth.status = 'authenticated'; auth.token = 'saved-session'; auth.isAuthenticated = true;
    auth.profile = { email: 'qa@example.com' }; auth.profileEmail = 'qa@example.com';
    auth.profilePhone = ''; auth.verificationStatus = 'approved'; auth.isVerified = true;
    auth.logout.mockImplementation(() => {
      const state = reactive(auth);
      state.status = 'guest'; state.token = ''; state.isAuthenticated = false; state.profile = null;
    });
    const wrapper = mountPage();
    expect(wrapper.text()).toContain('Личность подтверждена');
    expect(wrapper.text()).toContain('Ваш статус подтверждён.');
    expect(wrapper.text()).toContain('qa@example.com');
    expect(wrapper.text()).not.toContain('Телефон:');
    expect(wrapper.text()).not.toContain('Верификация\n');
    expect(auth.fetchProfile).not.toHaveBeenCalled();
    wrapper.unmount();
    const reopened = mountPage();
    expect(reopened.text()).toContain('qa@example.com');
    expect(auth.fetchProfile).not.toHaveBeenCalled();
    reopened.unmount();
    const wrapperAgain = mountPage();
    await wrapperAgain.findAll('button').find(button => button.text().includes('Выйти из аккаунта'))!.trigger('click');
    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/profile');
    expect(wrapperAgain.text()).toContain('Войти/авторизоваться');
    wrapperAgain.unmount();
  });
});
