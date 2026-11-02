import { RouteRecordRaw } from 'vue-router';
import { isMockMode } from '@/api/config';

const routes: RouteRecordRaw[] = [
  {
    path: '/start',
    component: () => import('pages/start/StartPage.vue'),
  },
  {
    path: '/kyc',
    component: () => import('layouts/KycLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'phone', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'phone/code', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'phone/status', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'documents', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'selfie', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'sending', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'result', component: () => import('pages/kyc/KycFlowPage.vue') },
      { path: 'blocked', component: () => import('pages/kyc/KycFlowPage.vue') },
    ],
  },
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
      { path: 'orders', component: () => isMockMode ? import('pages/orders/OrdersPage.vue') : import('pages/orders/ApiOrdersPage.vue'), meta: { requiresAuth: true } },
      { path: 'orders/history', component: () => isMockMode ? import('pages/orders/HistoryPage.vue') : import('pages/orders/ApiOrdersPage.vue'), props: { initialKind: 'ledger' }, meta: { requiresAuth: true } },
      { path: 'orders/:id', component: () => isMockMode ? import('pages/orders/OrderDetailPage.vue') : import('pages/orders/ApiOrderDetailPage.vue'), meta: { requiresAuth: true } },
      { path: 'wallet', component: () => import('pages/wallet/WalletPage.vue'), meta: { requiresApprovedKyc: true } },
      { path: 'wallet/deposit', component: () => import('pages/wallet/WalletDepositPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'wallet/deposit/rub', component: () => import('pages/wallet/WalletRubPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'wallet/deposit/rub/bank/:bankId', component: () => import('pages/wallet/WalletRubFormPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'wallet/deposit/rub/sbp', component: () => import('pages/wallet/WalletRubFormPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'wallet/deposit/rub/result', component: () => import('pages/wallet/WalletRubResultPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'referrals', component: () => isMockMode ? import('pages/referrals/ReferralsPage.vue') : import('pages/referrals/ApiReferralsPage.vue') },
      { path: 'referrals/account', component: () => isMockMode ? import('pages/referrals/ReferralAccountPage.vue') : import('pages/referrals/ApiReferralsPage.vue'), props: { view: 'account' }, meta: { requiresAuth: true } },
      { path: 'referrals/account/withdraw', component: () => import('pages/referrals/ReferralWithdrawPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'referrals/account/history', component: () => isMockMode ? import('pages/referrals/ReferralAccountHistoryPage.vue') : import('pages/referrals/ApiReferralsPage.vue'), props: { view: 'history' }, meta: { requiresAuth: true } },
      { path: 'referrals/my', component: () => isMockMode ? import('pages/referrals/ReferralsListPage.vue') : import('pages/referrals/ApiReferralsPage.vue'), props: { view: 'relations' }, meta: { requiresAuth: true } },
      { path: 'profile', component: () => import('pages/profile/ProfilePage.vue') },
      { path: 'profile/faq', component: () => import('pages/profile/ProfileFaqPage.vue') },
      { path: 'profile/data', component: () => import('pages/profile/ProfileDataPage.vue'), meta: { requiresAuth: true } },
      { path: 'exchange/cash', component: () => import('pages/exchange/CashExchangePage.vue'), meta: { requiresAuth: true } },
      { path: 'exchange/cash/confirm', component: () => import('pages/exchange/CashExchangeConfirmPage.vue'), meta: { mockOnly: true, requiresApprovedKyc: true } },
      { path: 'invoice', component: () => import('pages/exchange/InvoicePage.vue'), meta: { requiresAuth: true } },
      { path: 'unavailable', component: () => import('pages/error/FeatureUnavailablePage.vue') },
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

if (import.meta.env.DEV) {
  routes.splice(routes.length - 1, 0, {
    path: '/preview/kyc-phone-code',
    component: () => import('layouts/KycLayout.vue'),
    children: [{ path: '', component: () => import('pages/kyc/KycPhoneCodePreviewPage.vue') }],
  });
}

export default routes;
