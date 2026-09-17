import { defineStore } from 'pinia';
import type {
  CreateMockPaymentInput,
  PaymentMethodCode,
  PaymentResource,
  PaymentTypeCode,
} from '@/models';
import {
  createMockPaymentResource,
  getMockPaymentById,
  getMockPaymentsSnapshot,
} from '@/mocks/payments/payments';
import {
  isActivePaymentStatus,
  toHistoryOperationView,
  toOrderDetailView,
  toOrderListItemView,
} from '@/mocks/payments/adapters';
import { useAuthStore } from '@/stores/auth-store';

type WalletFlowMode = 'deposit' | 'withdraw';

function currentPaymentOwnerEmail() {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return '';
  }

  return authStore.profileEmail.trim().toLowerCase();
}

function canViewPayments() {
  return Boolean(currentPaymentOwnerEmail());
}

function canCreatePayments() {
  const authStore = useAuthStore();

  return authStore.isAuthenticated
    && authStore.verificationStatus === 'approved'
    && !authStore.kycBlocked;
}

function getScopedPayments() {
  const ownerEmail = currentPaymentOwnerEmail();
  return ownerEmail ? getMockPaymentsSnapshot(ownerEmail) : [];
}

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    // Kept as a local snapshot for compatibility with existing code. All
    // public getters resolve the active account dynamically so switching
    // demo accounts never leaks another user's requests/history.
    payments: [] as PaymentResource[],
    balanceUsdt: 100,
    mode: 'deposit' as WalletFlowMode,
    method: null as PaymentMethodCode | null,
    bankId: '',
    amount: '',
    currency: 'USDT',
    lastCreatedPaymentId: '',
  }),

  getters: {
    latestOperations: () => {
      if (!canViewPayments()) {
        return [];
      }

      return getScopedPayments()
        .sort((left, right) => (
          new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
        ))
        .slice(0, 5)
        .map(toHistoryOperationView);
    },
    ordersActive: () => {
      if (!canViewPayments()) {
        return [];
      }

      return getScopedPayments()
        .filter((payment) => isActivePaymentStatus(payment.attributes.status))
        .sort((left, right) => (
          new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
        ))
        .map(toOrderListItemView);
    },
    ordersCompleted: () => {
      if (!canViewPayments()) {
        return [];
      }

      return getScopedPayments()
        .filter((payment) => !isActivePaymentStatus(payment.attributes.status))
        .sort((left, right) => (
          new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
        ))
        .map(toOrderListItemView);
    },
    historyByType: () => (type: PaymentTypeCode) => {
      if (!canViewPayments()) {
        return [];
      }

      return getScopedPayments()
        .filter((payment) => payment.attributes.type === type)
        .sort((left, right) => (
          new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
        ))
        .map(toHistoryOperationView);
    },
    paymentById: () => (id: string) => {
      if (!canViewPayments()) {
        return null;
      }

      return getScopedPayments().find((payment) => payment.id === id) ?? null;
    },
    paymentDetailById: () => (id: string) => {
      if (!canViewPayments()) {
        return null;
      }

      const payment = getScopedPayments().find((item) => item.id === id);
      return payment ? toOrderDetailView(payment) : null;
    },
  },

  actions: {
    syncPayments() {
      const ownerEmail = currentPaymentOwnerEmail();
      this.payments = ownerEmail ? getMockPaymentsSnapshot(ownerEmail) : [];
    },
    setFlowMode(mode: WalletFlowMode) {
      this.mode = mode;
    },
    setFlowMethod(method: PaymentMethodCode | null) {
      this.method = method;
    },
    setFlowBankId(bankId: string) {
      this.bankId = bankId;
    },
    setFlowAmount(amount: string) {
      this.amount = amount;
    },
    resetFlow() {
      this.method = null;
      this.bankId = '';
      this.amount = '';
      this.currency = 'USDT';
    },
    createPayment(input: CreateMockPaymentInput) {
      if (!canCreatePayments()) {
        throw new Error('Операции доступны только авторизованным пользователям с подтвержденным KYC');
      }

      const ownerEmail = currentPaymentOwnerEmail();
      const payment = createMockPaymentResource(input, ownerEmail);
      this.syncPayments();
      this.lastCreatedPaymentId = payment.id;
      this.method = input.method;
      this.bankId = input.bankId ?? '';
      this.amount = input.amount;
      this.currency = input.currency;

      if (input.currency === 'USDT') {
        const amount = Number.parseFloat(input.amount);

        if (Number.isFinite(amount)) {
          this.balanceUsdt = Number.parseFloat((
            this.balanceUsdt + (input.type === 0 ? amount : -amount)
          ).toFixed(2));
        }
      }

      return payment;
    },
    getPaymentById(id: string) {
      if (!canViewPayments()) {
        return null;
      }

      const ownerEmail = currentPaymentOwnerEmail();
      return this.paymentById(id) ?? getMockPaymentById(id, ownerEmail);
    },
  },
});
