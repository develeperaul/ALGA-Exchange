export type PaymentStatusCode = 0 | 1 | 2 | 3 | 4 | 5;
export type PaymentMethodCode = 0 | 1 | 2;
export type PaymentTypeCode = 0 | 1;
export type PaymentCurrency = 'RUB' | 'USDT';

export interface PaymentPayload {
  deep_link: string | null;
  qr_url: string | null;
}

export interface PaymentBank {
  id: string;
  name: string;
  type: number;
}

export interface PaymentAttributes {
  status: PaymentStatusCode;
  amount: string;
  created_at: string;
  payload: PaymentPayload;
  bank: PaymentBank;
  method: PaymentMethodCode;
  currency: PaymentCurrency;
  type: PaymentTypeCode;
}

export interface PaymentResource {
  id: string;
  type: string;
  attributes: PaymentAttributes;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number;
  active: boolean;
}

export interface PaymentsLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaymentsMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  path: string;
  links: PaginationLink[];
}

export interface PaymentsResponse {
  data: PaymentResource[];
  links: PaymentsLinks;
  meta: PaymentsMeta;
}

export interface BankResource {
  id: string;
  type: string;
  attributes: {
    name: string;
    type: number;
    logotype: string;
  };
}

export interface BanksResponse {
  data: BankResource[];
}

export interface PaymentsFilter {
  sort?: 'created_at' | '-created_at';
  status?: PaymentStatusCode | PaymentStatusCode[];
  type?: PaymentTypeCode;
  method?: PaymentMethodCode;
}

export interface PaymentsPage {
  size?: number;
  number?: number;
}

export interface CreateMockPaymentInput {
  status?: PaymentStatusCode;
  amount: string;
  type: PaymentTypeCode;
  method: PaymentMethodCode;
  currency: PaymentCurrency;
  bankId?: string;
  deepLink?: string | null;
  qrUrl?: string | null;
}
