import { requestJson } from './client';
import { ApiError, invalidResponse } from './errors';
import { parseQuotes, type SharedQuote } from './quotes';

export interface PayoutOptions {
  cash_sell_min: string;
  cash_buy_min: string;
  invoice_min: string;
  time_slots: string[];
  timezone: string;
}
export interface CashPayoutInput {
  country: string; city: string; telegram_username: string; source_amount: string;
  direction: 'buy' | 'sell'; appointment_date: string; time_slot: string;
}
export interface InvoicePayoutInput {
  country: string; telegram_username: string; source_amount: string; description: string;
}
export type TransactionInput =
  | { type: 'buy'; quote_id: string; amount_to: string }
  | { type: 'sell'; quote_id: string; amount_to: string; recipient: { pan: string } | { phone: string; bank: string } }
  | { type: 'transfer'; amount_to: string; address: string };

function resourceId(value: unknown): string {
  if (!value || typeof value !== 'object' || !('data' in value)) throw invalidResponse();
  const data = value.data;
  if (!data || typeof data !== 'object' || !('id' in data) ||
    (typeof data.id !== 'string' && typeof data.id !== 'number')) throw invalidResponse();
  return String(data.id);
}
export async function fetchPayoutOptions(): Promise<PayoutOptions> {
  const response = await requestJson<unknown>('/api/payouts/options', { cache: 'no-store' }, true);
  if (!response || typeof response !== 'object' || !('data' in response)) throw invalidResponse();
  const data = response.data as PayoutOptions;
  if (!data || !/^\d+\.\d{2}$/.test(data.cash_sell_min) || !/^\d+\.\d{2}$/.test(data.cash_buy_min) ||
    !/^\d+\.\d{2}$/.test(data.invoice_min) || !Array.isArray(data.time_slots) ||
    !data.time_slots.every(slot => typeof slot === 'string' && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot)) ||
    typeof data.timezone !== 'string') throw invalidResponse();
  return data;
}
export async function createCashPayout(input: CashPayoutInput): Promise<string> {
  return resourceId(await requestJson<unknown>('/api/payouts/cash', { method: 'post', json: input, retry: 0 }, true));
}
export async function createInvoicePayout(input: InvoicePayoutInput): Promise<string> {
  return resourceId(await requestJson<unknown>('/api/payouts/invoices', { method: 'post', json: input, retry: 0 }, true));
}
export async function createTransaction(input: TransactionInput, idempotencyKey: string, signal?: AbortSignal): Promise<string> {
  return resourceId(await requestJson<unknown>('/api/transactions', {
    method: 'post', json: input, headers: { 'Idempotency-Key': idempotencyKey }, retry: 0, signal,
  }, true));
}
export function isAmbiguousPayoutFailure(error: unknown): boolean {
  return !(error instanceof ApiError && error.status !== null &&
    error.status >= 400 && error.status < 500 && error.status !== 408 && error.code !== 'invalid_response');
}
export function validAmount(value: string, minimum: string, precision: number): boolean {
  if (!new RegExp(`^\\d{1,12}(\\.\\d{1,${precision}})?$`).test(value) || !/[1-9]/.test(value)) return false;
  const [whole, fraction = ''] = value.split('.');
  const [minWhole, minFraction = ''] = minimum.split('.');
  const scale = Math.max(fraction.length, minFraction.length);
  return BigInt(whole) * 10n ** BigInt(scale) + BigInt(fraction.padEnd(scale, '0')) >=
    BigInt(minWhole) * 10n ** BigInt(scale) + BigInt(minFraction.padEnd(scale, '0'));
}
export function selectedQuote(quotes: SharedQuote[], id: string): SharedQuote | null {
  return quotes.find(q => q.quote_id === id && Date.parse(q.expires_at) > Date.now()) ?? null;
}
export async function fetchOperationQuotes(type: 'buy' | 'sell', method: 'card' | 'sbp', signal?: AbortSignal): Promise<SharedQuote[]> {
  const searchParams = new URLSearchParams({ type, method });
  const quotes = parseQuotes(await requestJson<unknown>(`/api/quotes?${searchParams}`, { cache: 'no-store', retry: 0, signal }));
  return quotes.filter(q => q.type === type && q.method === method && Date.parse(q.expires_at) > Date.now());
}
