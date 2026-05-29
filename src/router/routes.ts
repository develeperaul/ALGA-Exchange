import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('pages/auth/AuthPage.vue'),
  },
  {
    path: '/registration',
    component: () => import('pages/auth/RegPage.vue'),
  },
  {
    path: '/reset-password',
    component: () => import('pages/auth/ResetPage.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home/IndexPage.vue') },
      { path: 'orders', component: () => import('pages/orders/OrdersPage.vue') },
      { path: 'orders/history', component: () => import('pages/orders/HistoryPage.vue') },
      { path: 'orders/:id', component: () => import('pages/orders/OrderDetailPage.vue') },
      { path: 'wallet', component: () => import('pages/wallet/WalletPage.vue') },
      { path: 'wallet/deposit', component: () => import('pages/wallet/WalletDepositPage.vue') },
      { path: 'wallet/deposit/rub', component: () => import('pages/wallet/WalletRubPage.vue') },
      { path: 'wallet/deposit/rub/bank/:bankId', component: () => import('pages/wallet/WalletRubFormPage.vue') },
      { path: 'wallet/deposit/rub/sbp', component: () => import('pages/wallet/WalletRubFormPage.vue') },
      { path: 'wallet/deposit/rub/result', component: () => import('pages/wallet/WalletRubResultPage.vue') },
      { path: 'referrals', component: () => import('pages/referrals/ReferralsPage.vue') },
      { path: 'referrals/account', component: () => import('pages/referrals/ReferralAccountPage.vue') },
      { path: 'referrals/account/withdraw', component: () => import('pages/referrals/ReferralWithdrawPage.vue') },
      { path: 'referrals/account/history', component: () => import('pages/referrals/ReferralAccountHistoryPage.vue') },
      { path: 'referrals/my', component: () => import('pages/referrals/ReferralsListPage.vue') },
      { path: 'profile', component: () => import('pages/profile/ProfilePage.vue') },
      { path: 'profile/faq', component: () => import('pages/profile/ProfileFaqPage.vue') },
      { path: 'profile/data', component: () => import('pages/profile/ProfileDataPage.vue') },
      { path: 'ui-kit', component: () => import('pages/ui-kit/UiKitPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error/ErrorNotFound.vue'),
  },
];

export default routes;
