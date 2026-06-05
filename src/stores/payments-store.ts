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

type WalletFlowMode = 'deposit' | 'withdraw';

export const usePaymentsStore = defineStore('payments', {
  state: () => ({
    payments: getMockPaymentsSnapshot() as PaymentResource[],
    balanceUsdt: 100,
    mode: 'deposit' as WalletFlowMode,
    method: null as PaymentMethodCode | null,
    bankId: '',
    amount: '',
    currency: 'USDT',
    lastCreatedPaymentId: '',
  }),

  getters: {
    latestOperations: (state) => [...state.payments]
      .sort((left, right) => (
        new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
      ))
      .slice(0, 5)
      .map(toHistoryOperationView),
    ordersActive: (state) => [...state.payments]
      .filter((payment) => isActivePaymentStatus(payment.attributes.status))
      .sort((left, right) => (
        new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
      ))
      .map(toOrderListItemView),
    ordersCompleted: (state) => [...state.payments]
      .filter((payment) => !isActivePaymentStatus(payment.attributes.status))
      .sort((left, right) => (
        new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
      ))
      .map(toOrderListItemView),
    historyByType: (state) => (type: PaymentTypeCode) => [...state.payments]
      .filter((payment) => payment.attributes.type === type)
      .sort((left, right) => (
        new Date(right.attributes.created_at).getTime() - new Date(left.attributes.created_at).getTime()
      ))
      .map(toHistoryOperationView),
    paymentById: (state) => (id: string) => state.payments.find((payment) => payment.id === id) ?? null,
    paymentDetailById: (state) => (id: string) => {
      const payment = state.payments.find((item) => item.id === id);
      return payment ? toOrderDetailView(payment) : null;
    },
  },

  actions: {
    syncPayments() {
      this.payments = getMockPaymentsSnapshot();
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
      const payment = createMockPaymentResource(input);
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
      return this.paymentById(id) ?? getMockPaymentById(id);
    },
  },
});
