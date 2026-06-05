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
import { mockBanksResponse } from '@/mocks/payments/banks';

const PAYMENTS_PATH = 'http://localhost/api/payments';
const DEFAULT_PAGE_SIZE = 15;

let paymentIdCounter = 1000;

const seedPayments: PaymentResource[] = [
  {
    id: '1',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '4332.13',
      created_at: '2026-05-24T09:26:44Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('1'),
      method: 0,
      currency: 'RUB',
      type: 0,
    },
  },
  {
    id: '2',
    type: 'payments',
    attributes: {
      status: 1,
      amount: '1800.00',
      created_at: '2026-05-26T12:14:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('3'),
      method: 0,
      currency: 'USDT',
      type: 1,
    },
  },
  {
    id: '3',
    type: 'payments',
    attributes: {
      status: 0,
      amount: '22000.00',
      created_at: '2026-05-27T08:10:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('4'),
      method: 1,
      currency: 'RUB',
      type: 0,
    },
  },
  {
    id: '4',
    type: 'payments',
    attributes: {
      status: 5,
      amount: '950.00',
      created_at: '2026-05-22T14:45:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('2'),
      method: 0,
      currency: 'USDT',
      type: 1,
    },
  },
  {
    id: '5',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '1200.00',
      created_at: '2026-05-28T10:01:00Z',
      payload: {
        deep_link: 'https://example.com/payments/5',
        qr_url: 'https://example.com/payments/5/qr',
      },
      bank: makeBankSnapshot('4'),
      method: 2,
      currency: 'USDT',
      type: 0,
    },
  },
  {
    id: '6',
    type: 'payments',
    attributes: {
      status: 2,
      amount: '8600.00',
      created_at: '2026-05-29T16:20:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('1'),
      method: 0,
      currency: 'RUB',
      type: 1,
    },
  },
  {
    id: '7',
    type: 'payments',
    attributes: {
      status: 3,
      amount: '785.50',
      created_at: '2026-05-30T06:32:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('3'),
      method: 0,
      currency: 'USDT',
      type: 0,
    },
  },
  {
    id: '8',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '15000.00',
      created_at: '2026-05-20T09:10:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('2'),
      method: 1,
      currency: 'RUB',
      type: 1,
    },
  },
  {
    id: '9',
    type: 'payments',
    attributes: {
      status: 1,
      amount: '410.00',
      created_at: '2026-05-31T08:11:00Z',
      payload: {
        deep_link: 'https://example.com/payments/9',
        qr_url: 'https://example.com/payments/9/qr',
      },
      bank: makeBankSnapshot('4'),
      method: 2,
      currency: 'USDT',
      type: 1,
    },
  },
  {
    id: '10',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '6400.00',
      created_at: '2026-05-19T07:25:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('1'),
      method: 0,
      currency: 'RUB',
      type: 0,
    },
  },
  {
    id: '11',
    type: 'payments',
    attributes: {
      status: 0,
      amount: '930.20',
      created_at: '2026-05-18T13:05:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('4'),
      method: 1,
      currency: 'USDT',
      type: 1,
    },
  },
  {
    id: '12',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '21000.00',
      created_at: '2026-05-17T15:18:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('3'),
      method: 0,
      currency: 'RUB',
      type: 0,
    },
  },
  {
    id: '13',
    type: 'payments',
    attributes: {
      status: 5,
      amount: '560.00',
      created_at: '2026-05-16T18:44:00Z',
      payload: {
        deep_link: 'https://example.com/payments/13',
        qr_url: 'https://example.com/payments/13/qr',
      },
      bank: makeBankSnapshot('4'),
      method: 2,
      currency: 'USDT',
      type: 0,
    },
  },
  {
    id: '14',
    type: 'payments',
    attributes: {
      status: 1,
      amount: '3200.00',
      created_at: '2026-05-15T10:10:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('2'),
      method: 0,
      currency: 'RUB',
      type: 1,
    },
  },
  {
    id: '15',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '112.00',
      created_at: '2026-05-14T07:30:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('1'),
      method: 1,
      currency: 'USDT',
      type: 0,
    },
  },
  {
    id: '16',
    type: 'payments',
    attributes: {
      status: 3,
      amount: '8700.00',
      created_at: '2026-05-13T09:05:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('3'),
      method: 0,
      currency: 'RUB',
      type: 1,
    },
  },
  {
    id: '17',
    type: 'payments',
    attributes: {
      status: 4,
      amount: '730.75',
      created_at: '2026-05-12T12:12:00Z',
      payload: {
        deep_link: 'https://example.com/payments/17',
        qr_url: 'https://example.com/payments/17/qr',
      },
      bank: makeBankSnapshot('4'),
      method: 2,
      currency: 'USDT',
      type: 0,
    },
  },
  {
    id: '18',
    type: 'payments',
    attributes: {
      status: 2,
      amount: '14200.00',
      created_at: '2026-05-11T17:20:00Z',
      payload: { deep_link: null, qr_url: null },
      bank: makeBankSnapshot('2'),
      method: 0,
      currency: 'RUB',
      type: 1,
    },
  },
];

let mockPayments = [...seedPayments];

export function getMockPaymentsSnapshot() {
  return [...mockPayments];
}

function makeBankSnapshot(bankId: string): PaymentBank {
  const bank = mockBanksResponse.data.find((item) => item.id === bankId) ?? mockBanksResponse.data[0];

  return {
    id: bank.id,
    name: bank.attributes.name,
    type: bank.attributes.type,
  };
}

function makeNamedBankSnapshot(bankId: string): PaymentBank {
  const known = mockBanksResponse.data.find((item) => item.id === bankId);

  if (known) {
    return {
      id: known.id,
      name: known.attributes.name,
      type: known.attributes.type,
    };
  }

  return {
    id: bankId,
    name: bankId,
    type: 0,
  };
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
}: {
  filter?: PaymentsFilter;
  page?: PaymentsPage;
} = {}): PaymentsResponse {
  const statusFilter = normalizeStatusFilter(filter.status);
  const pageSize = page.size ?? DEFAULT_PAGE_SIZE;
  const pageNumber = page.number ?? 1;

  let items = [...mockPayments];

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

export function getMockPaymentById(transactionId: string) {
  return mockPayments.find((item) => item.id === transactionId) ?? null;
}

export function getMockBanksResponse() {
  return mockBanksResponse;
}

export function createMockPaymentResource(input: CreateMockPaymentInput) {
  paymentIdCounter += 1;

  const bank = input.method === 2
    ? {
        id: 'crypto',
        name: input.currency === 'USDT' ? 'tron' : 'crypto',
        type: 2,
      }
    : makeNamedBankSnapshot(input.bankId ?? '1');

  const payment: PaymentResource = {
    id: String(paymentIdCounter),
    type: 'payments',
    attributes: {
      status: input.status ?? 0,
      amount: input.amount,
      created_at: new Date().toISOString(),
      payload: {
        deep_link: input.deepLink ?? (input.method === 2 ? 'https://example.com/payments/deep-link' : null),
        qr_url: input.qrUrl ?? (input.method === 2 ? 'https://example.com/payments/qr-code' : null),
      },
      bank,
      method: input.method,
      currency: input.currency,
      type: input.type,
    },
  };

  mockPayments = [payment, ...mockPayments];

  return payment;
}

export function resetMockPayments() {
  mockPayments = [...seedPayments];
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
