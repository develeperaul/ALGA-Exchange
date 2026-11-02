import { requestJson } from './client';
import { invalidResponse } from './errors';

export interface SharedQuote {
  quote_id: string;
  type: 'buy' | 'sell';
  method: 'card' | 'sbp';
  currency_from: 'RUB' | 'USDT';
  currency_to: 'RUB' | 'USDT';
  rate: string;
  rate_currency: 'RUB';
  rate_unit: 'USDT';
  fee_percent: string;
  expires_at: string;
}
export interface CashRate {
  id: string;
  type: 'rates';
  attributes: {
    currency_from: string; currency_to: string; rate: string;
    type: 0 | 1; expires_at: string | null;
  };
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object';
export const isPositiveDecimal = (value: unknown): value is string =>
  typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) && /[1-9]/.test(value);
export const isCurrentQuote = (value: { expires_at: string | null }, now = Date.now()) =>
  value.expires_at === null || Date.parse(value.expires_at) > now;

export function parseQuotes(value: unknown): SharedQuote[] {
  if (!record(value) || !Array.isArray(value.data)) throw invalidResponse();
  return value.data.map((q: unknown) => {
    if (!record(q) || typeof q.quote_id !== 'string' || !q.quote_id ||
      !['buy', 'sell'].includes(String(q.type)) || !['card', 'sbp'].includes(String(q.method)) ||
      (q.type === 'buy' && q.method !== 'sbp') ||
      q.currency_from !== (q.type === 'buy' ? 'RUB' : 'USDT') ||
      q.currency_to !== (q.type === 'buy' ? 'USDT' : 'RUB') ||
      q.rate_currency !== 'RUB' || q.rate_unit !== 'USDT' || !isPositiveDecimal(q.rate) ||
      typeof q.fee_percent !== 'string' || !/^\d+(\.\d+)?$/.test(q.fee_percent) ||
      typeof q.expires_at !== 'string' || !Number.isFinite(Date.parse(q.expires_at))) throw invalidResponse();
    return q as unknown as SharedQuote;
  });
}
export function parseCashRates(value: unknown): CashRate[] {
  if (!record(value) || !Array.isArray(value.data)) throw invalidResponse();
  return value.data.map((r: unknown) => {
    if (!record(r) || typeof r.id !== 'string' || r.type !== 'rates' || !record(r.attributes)) throw invalidResponse();
    const a = r.attributes;
    if (typeof a.currency_from !== 'string' || typeof a.currency_to !== 'string' ||
      !isPositiveDecimal(a.rate) || (a.type !== 0 && a.type !== 1) ||
      !(a.expires_at === null || (typeof a.expires_at === 'string' && Number.isFinite(Date.parse(a.expires_at))))) throw invalidResponse();
    return r as unknown as CashRate;
  });
}
// Public reads: never use the authenticated client, supply an amount, or cache a quote.
export async function fetchQuotes(signal?: AbortSignal): Promise<SharedQuote[]> {
  return parseQuotes(await requestJson<unknown>('/api/quotes', { signal, cache: 'no-store', retry: 0 }));
}
export async function fetchCashRates(signal?: AbortSignal): Promise<CashRate[]> {
  return parseCashRates(await requestJson<unknown>('/api/rates', { signal, cache: 'no-store', retry: 0 }));
}
