import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { useAuthStore } from 'stores/auth-store';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to) => {
    const authStore = useAuthStore(store);
    const requiresAuth = Boolean(to.meta.requiresAuth);
    const requiresApprovedKyc = Boolean(to.meta.requiresApprovedKyc);
    const isProtectedRoute = requiresAuth || requiresApprovedKyc;

    if (isProtectedRoute && !authStore.isAuthenticated) {
      return '/auth';
    }

    // The token is restored synchronously, while the profile is loaded
    // asynchronously. Protected routes must wait for the profile before
    // making an authorization/KYC decision after a page refresh.
    if (isProtectedRoute && authStore.isAuthenticated && !authStore.profile) {
      await authStore.fetchProfile();
    }

    if (isProtectedRoute && !authStore.isAuthenticated) {
      return '/auth';
    }

    if (requiresApprovedKyc) {
      if (authStore.kycBlocked) {
        return '/kyc/blocked';
      }

      if (authStore.verificationStatus !== 'approved') {
        return '/profile';
      }
    }

    if (
      authStore.isAuthenticated &&
      (to.path === '/auth' || to.path === '/registration' || to.path === '/reset-password')
    ) {
      return '/';
    }

    return true;
  });

  return Router;
});
