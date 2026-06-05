import type { OrderRequestStatus } from '@/components/orders/OrderRequestCard.vue';
import type { WalletOpDirection, WalletOpTone } from '@/components/wallet/WalletOperationRow.vue';
import type { PaymentResource, PaymentStatusCode } from '@/models';
import { getMethodLabel, getStatusLabel } from '@/mocks/payments/payments';

export interface OrderListItemView {
  id: string;
  requestId: string;
  status: OrderRequestStatus;
  title: string;
  subtitle: string;
  date: string;
  amount: string;
  amountTone: 'default' | 'danger';
  nodeId: string;
}

export interface HistoryOperationView {
  id: string;
  direction: WalletOpDirection;
  title: string;
  subtitle: string;
  amount: string;
  tone: WalletOpTone;
  date: string;
}

export interface OrderDetailView {
  id: string;
  title: string;
  status: OrderRequestStatus;
  statusLabel: string;
  date: string;
  amount: string;
  bankName: string;
  bankIcon: string;
  methodLabel: string;
  currencyLabel: string;
  deepLink: string;
  qrUrl: string;
}

function formatPaymentDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function getUiStatus(status: PaymentStatusCode): OrderRequestStatus {
  if (status === 4) return 'completed';
  if (status === 5) return 'cancelled';
  return 'processing';
}

function getTitle(type: PaymentResource['attributes']['type']) {
  return type === 0 ? 'Пополнение' : 'Вывод средств';
}

function getSubtitle(payment: PaymentResource) {
  if (payment.attributes.method === 2) {
    return payment.attributes.bank.name.toUpperCase();
  }

  if (payment.attributes.method === 1) {
    return 'СБП';
  }

  return payment.attributes.bank.name;
}

function formatAmount(payment: PaymentResource) {
  const sign = payment.attributes.type === 0 ? '+' : '-';

  return `${sign}${payment.attributes.amount} ${payment.attributes.currency}`;
}

export function toOrderListItemView(payment: PaymentResource): OrderListItemView {
  return {
    id: payment.id,
    requestId: payment.id,
    status: getUiStatus(payment.attributes.status),
    title: getTitle(payment.attributes.type),
    subtitle: getSubtitle(payment),
    date: formatPaymentDate(payment.attributes.created_at),
    amount: formatAmount(payment),
    amountTone: payment.attributes.type === 0 ? 'danger' : 'default',
    nodeId: '',
  };
}

export function toHistoryOperationView(payment: PaymentResource): HistoryOperationView {
  return {
    id: payment.id,
    direction: payment.attributes.type === 0 ? 'in' : 'out',
    title: getTitle(payment.attributes.type),
    subtitle: getSubtitle(payment),
    amount: formatAmount(payment),
    tone: payment.attributes.type === 0 ? 'positive' : 'default',
    date: formatPaymentDate(payment.attributes.created_at),
  };
}

export function toOrderDetailView(payment: PaymentResource): OrderDetailView {
  return {
    id: payment.id,
    title: getTitle(payment.attributes.type),
    status: getUiStatus(payment.attributes.status),
    statusLabel: getStatusLabel(payment.attributes.status),
    date: formatPaymentDate(payment.attributes.created_at),
    amount: formatAmount(payment),
    bankName: getSubtitle(payment),
    bankIcon: payment.attributes.bank.name.charAt(0).toUpperCase(),
    methodLabel: getMethodLabel(payment.attributes.method),
    currencyLabel: payment.attributes.currency,
    deepLink: payment.attributes.payload.deep_link ?? '—',
    qrUrl: payment.attributes.payload.qr_url ?? '—',
  };
}

export function isActivePaymentStatus(status: PaymentStatusCode) {
  return getUiStatus(status) === 'processing';
}
