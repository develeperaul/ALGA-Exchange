import type {
  BankResource,
  CreateMockPaymentInput,
  PaymentBank,
  PaymentMethodCode,
  PaymentResource,
  PaymentsFilter,
  PaymentsMeta,
  PaymentsPage,
  PaymentsResponse,
  PaymentStatusCode,
} from '@/models';
import {
  mockBanksResponse,
  type MockBankId,
} from '@/mocks/payments/banks';

const PAYMENTS_PATH = '/mock-api/payments';
const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAYMENT_OWNER = 'demo@alga.exchange';

let paymentIdCounter = 1000;

type SeedPayment = {
  id: string;
  status: PaymentStatusCode;
  amount: string;
  createdAt: string;
  bankId: MockBankId;
  method: PaymentMethodCode;
  currency: PaymentResource['attributes']['currency'];
  type: PaymentResource['attributes']['type'];
};

const demoSeedRows: SeedPayment[] = [
  { id: '1', status: 4, amount: '4332.13', createdAt: '2026-09-16T09:26:44Z', bankId: 'sber', method: 0, currency: 'RUB', type: 0 },
  { id: '2', status: 1, amount: '1800.00', createdAt: '2026-09-15T12:14:00Z', bankId: 'tbank', method: 0, currency: 'USDT', type: 1 },
  { id: '3', status: 0, amount: '22000.00', createdAt: '2026-09-14T08:10:00Z', bankId: 'vtb', method: 1, currency: 'RUB', type: 0 },
  { id: '4', status: 5, amount: '950.00', createdAt: '2026-09-13T14:45:00Z', bankId: 'mts', method: 0, currency: 'USDT', type: 1 },
  { id: '5', status: 4, amount: '1200.00', createdAt: '2026-09-12T10:01:00Z', bankId: 'alfa', method: 2, currency: 'USDT', type: 0 },
  { id: '6', status: 2, amount: '8600.00', createdAt: '2026-09-11T16:20:00Z', bankId: 'gazprombank', method: 0, currency: 'RUB', type: 1 },
  { id: '7', status: 3, amount: '785.50', createdAt: '2026-09-10T06:32:00Z', bankId: 'rosselkhoz', method: 0, currency: 'USDT', type: 0 },
  { id: '8', status: 4, amount: '15000.00', createdAt: '2026-09-09T09:10:00Z', bankId: 'sovcombank', method: 1, currency: 'RUB', type: 1 },
  { id: '9', status: 1, amount: '410.00', createdAt: '2026-09-08T08:11:00Z', bankId: 'psb', method: 1, currency: 'USDT', type: 1 },
  { id: '10', status: 4, amount: '6400.00', createdAt: '2026-09-07T07:25:00Z', bankId: 'mkb', method: 0, currency: 'RUB', type: 0 },
  { id: '11', status: 0, amount: '930.20', createdAt: '2026-09-06T13:05:00Z', bankId: 'sber', method: 1, currency: 'USDT', type: 1 },
  { id: '12', status: 4, amount: '21000.00', createdAt: '2026-09-05T15:18:00Z', bankId: 'alfa', method: 0, currency: 'RUB', type: 0 },
  { id: '13', status: 5, amount: '560.00', createdAt: '2026-09-04T18:44:00Z', bankId: 'gazprombank', method: 2, currency: 'USDT', type: 0 },
  { id: '14', status: 1, amount: '3200.00', createdAt: '2026-09-03T10:10:00Z', bankId: 'tbank', method: 0, currency: 'RUB', type: 1 },
  { id: '15', status: 4, amount: '112.00', createdAt: '2026-09-02T07:30:00Z', bankId: 'rosselkhoz', method: 1, currency: 'USDT', type: 0 },
  { id: '16', status: 3, amount: '8700.00', createdAt: '2026-09-01T09:05:00Z', bankId: 'sovcombank', method: 0, currency: 'RUB', type: 1 },
  { id: '17', status: 4, amount: '730.75', createdAt: '2026-08-31T12:12:00Z', bankId: 'psb', method: 0, currency: 'USDT', type: 0 },
  { id: '18', status: 2, amount: '14200.00', createdAt: '2026-08-30T17:20:00Z', bankId: 'mkb', method: 0, currency: 'RUB', type: 1 },
];

const approvedSeedRows: SeedPayment[] = [
  { id: 'approved-1', status: 4, amount: '12500.00', createdAt: '2026-09-15T07:40:00Z', bankId: 'alfa', method: 0, currency: 'RUB', type: 0 },
  { id: 'approved-2', status: 1, amount: '640.00', createdAt: '2026-09-12T11:05:00Z', bankId: 'sber', method: 2, currency: 'USDT', type: 1 },
  { id: 'approved-3', status: 4, amount: '4800.00', createdAt: '2026-09-08T13:18:00Z', bankId: 'vtb', method: 1, currency: 'RUB', type: 1 },
];

const blockedSeedRows: SeedPayment[] = [
  { id: 'blocked-1', status: 4, amount: '9800.00', createdAt: '2026-08-27T10:15:00Z', bankId: 'gazprombank', method: 0, currency: 'RUB', type: 0 },
  { id: 'blocked-2', status: 5, amount: '350.00', createdAt: '2026-08-22T16:30:00Z', bankId: 'tbank', method: 2, currency: 'USDT', type: 1 },
];

function normalizeOwnerEmail(ownerEmail?: string | null) {
  return String(ownerEmail ?? '').trim().toLowerCase();
}

function makeBankSnapshot(bankId: string): PaymentBank {
  const bank = getBankResourceById(bankId) ?? mockBanksResponse.data[0];

  return {
    id: bank.id,
    name: bank.attributes.name,
    type: bank.attributes.type,
  };
}

function makeCryptoSnapshot(currency: PaymentResource['attributes']['currency']): PaymentBank {
  return {
    id: 'crypto',
    name: currency === 'USDT' ? 'TRON' : 'Crypto',
    type: 2,
  };
}

function makeSeedPayment(row: SeedPayment): PaymentResource {
  return {
    id: row.id,
    type: 'payments',
    attributes: {
      status: row.status,
      amount: row.amount,
      created_at: row.createdAt,
      payload: {
        deep_link: row.method === 2 ? `#/mock-payment/${row.id}` : null,
        qr_url: null,
      },
      bank: row.method === 2 ? makeCryptoSnapshot(row.currency) : makeBankSnapshot(row.bankId),
      method: row.method,
      currency: row.currency,
      type: row.type,
    },
  };
}

const seedPaymentsByOwner = new Map<string, PaymentResource[]>([
  [DEFAULT_PAYMENT_OWNER, demoSeedRows.map(makeSeedPayment)],
  ['approved@alga.exchange', approvedSeedRows.map(makeSeedPayment)],
  ['blocked@alga.exchange', blockedSeedRows.map(makeSeedPayment)],
  ['unverified@alga.exchange', []],
  ['pending@alga.exchange', []],
  ['rejected@alga.exchange', []],
]);

const mockPaymentsByOwner = new Map<string, PaymentResource[]>(
  [...seedPaymentsByOwner.entries()].map(([ownerEmail, payments]) => [ownerEmail, [...payments]]),
);

function getOwnerPayments(ownerEmail?: string | null) {
  const owner = normalizeOwnerEmail(ownerEmail);

  if (!owner) {
    return [];
  }

  if (!mockPaymentsByOwner.has(owner)) {
    mockPaymentsByOwner.set(owner, []);
  }

  return mockPaymentsByOwner.get(owner)!;
}

export function getMockPaymentsSnapshot(ownerEmail: string = DEFAULT_PAYMENT_OWNER) {
  return [...getOwnerPayments(ownerEmail)];
}

function normalizeStatusFilter(status?: PaymentsFilter['status']) {
  if (typeof status === 'undefined') return null;
  return Array.isArray(status) ? status : [status];
}

function sortPayments(items: PaymentResource[], sort: PaymentsFilter['sort']) {
  const direction = sort === 'created_at' ? 1 : -1;

  return [...items].sort((left, right) => {
    const leftTime = new Date(left.attributes.created_at).getTime();
    const rightTime = new Date(right.attributes.created_at).getTime();

    return (leftTime - rightTime) * direction;
  });
}

function buildMeta(total: number, currentPage: number, perPage: number): PaymentsMeta {
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? null : (currentPage - 1) * perPage + 1;
  const to = total === 0 ? null : Math.min(currentPage * perPage, total);

  return {
    current_page: currentPage,
    from,
    last_page: lastPage,
    per_page: perPage,
    to,
    total,
    path: PAYMENTS_PATH,
    links: Array.from({ length: lastPage }, (_, index) => {
      const page = index + 1;

      return {
        url: `${PAYMENTS_PATH}?page=${page}`,
        label: String(page),
        page,
        active: page === currentPage,
      };
    }),
  };
}

function buildLinks(meta: PaymentsMeta) {
  const prevPage = meta.current_page > 1 ? meta.current_page - 1 : null;
  const nextPage = meta.current_page < meta.last_page ? meta.current_page + 1 : null;

  return {
    first: `${PAYMENTS_PATH}?page=1`,
    last: `${PAYMENTS_PATH}?page=${meta.last_page}`,
    prev: prevPage ? `${PAYMENTS_PATH}?page=${prevPage}` : null,
    next: nextPage ? `${PAYMENTS_PATH}?page=${nextPage}` : null,
  };
}

export function getMockPaymentsResponse({
  filter = {},
  page = {},
  ownerEmail = DEFAULT_PAYMENT_OWNER,
}: {
  filter?: PaymentsFilter;
  page?: PaymentsPage;
  ownerEmail?: string;
} = {}): PaymentsResponse {
  const statusFilter = normalizeStatusFilter(filter.status);
  const pageSize = page.size ?? DEFAULT_PAGE_SIZE;
  const pageNumber = page.number ?? 1;

  let items = getMockPaymentsSnapshot(ownerEmail);

  if (statusFilter) {
    items = items.filter((item) => statusFilter.includes(item.attributes.status));
  }

  if (typeof filter.type !== 'undefined') {
    items = items.filter((item) => item.attributes.type === filter.type);
  }

  if (typeof filter.method !== 'undefined') {
    items = items.filter((item) => item.attributes.method === filter.method);
  }

  items = sortPayments(items, filter.sort);

  const total = items.length;
  const meta = buildMeta(total, pageNumber, pageSize);
  const startIndex = (pageNumber - 1) * pageSize;
  const pagedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    data: pagedItems,
    links: buildLinks(meta),
    meta: {
      ...meta,
      links: [
        {
          url: meta.current_page > 1 ? `${PAYMENTS_PATH}?page=${meta.current_page - 1}` : null,
          label: '« Previous',
          page: Math.max(1, meta.current_page - 1),
          active: false,
        },
        ...meta.links,
        {
          url: meta.current_page < meta.last_page ? `${PAYMENTS_PATH}?page=${meta.current_page + 1}` : null,
          label: 'Next »',
          page: Math.min(meta.last_page, meta.current_page + 1),
          active: false,
        },
      ],
    },
  };
}

export function getMockPaymentById(transactionId: string, ownerEmail: string = DEFAULT_PAYMENT_OWNER) {
  return getOwnerPayments(ownerEmail).find((item) => item.id === transactionId) ?? null;
}

export function getMockBanksResponse() {
  return mockBanksResponse;
}

function normalizeLocalReference(value?: string | null) {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? null : value;
}

export function createMockPaymentResource(
  input: CreateMockPaymentInput,
  ownerEmail: string = DEFAULT_PAYMENT_OWNER,
) {
  const owner = normalizeOwnerEmail(ownerEmail) || DEFAULT_PAYMENT_OWNER;
  paymentIdCounter += 1;

  const payment: PaymentResource = {
    id: `${owner.replace(/[^a-z0-9]+/g, '-')}-${paymentIdCounter}`,
    type: 'payments',
    attributes: {
      status: input.status ?? 0,
      amount: input.amount,
      created_at: new Date().toISOString(),
      payload: {
        deep_link: normalizeLocalReference(input.deepLink) ?? (input.method === 2 ? '#/wallet' : null),
        qr_url: normalizeLocalReference(input.qrUrl),
      },
      bank: input.method === 2
        ? makeCryptoSnapshot(input.currency)
        : makeBankSnapshot(input.bankId ?? 'sber'),
      method: input.method,
      currency: input.currency,
      type: input.type,
    },
  };

  const ownerPayments = getOwnerPayments(owner);
  mockPaymentsByOwner.set(owner, [payment, ...ownerPayments]);

  return payment;
}

export function resetMockPayments(ownerEmail?: string) {
  if (ownerEmail) {
    const owner = normalizeOwnerEmail(ownerEmail);
    const seed = seedPaymentsByOwner.get(owner) ?? [];
    mockPaymentsByOwner.set(owner, [...seed]);
    return;
  }

  mockPaymentsByOwner.clear();

  seedPaymentsByOwner.forEach((payments, owner) => {
    mockPaymentsByOwner.set(owner, [...payments]);
  });

  paymentIdCounter = 1000;
}

export function getBankResourceById(bankId: string): BankResource | null {
  return mockBanksResponse.data.find((item) => item.id === bankId) ?? null;
}

export function getMethodLabel(method: PaymentMethodCode) {
  const labels: Record<PaymentMethodCode, string> = {
    0: 'Банк',
    1: 'СБП',
    2: 'Криптовалюта',
  };

  return labels[method];
}

export function getStatusLabel(status: PaymentStatusCode) {
  const labels: Record<PaymentStatusCode, string> = {
    0: 'Создана',
    1: 'В обработке',
    2: 'Ожидает подтверждения',
    3: 'Ожидает перевода',
    4: 'Исполнена',
    5: 'Отменена',
  };

  return labels[status];
}
