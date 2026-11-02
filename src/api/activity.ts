import { requestJson } from './client';
import { invalidResponse } from './errors';

export interface Resource<A> { id: string; type: string; attributes: A }
export interface Page<A> { items: Resource<A>[]; next: string | null }
export type HistoryKind = 'transactions' | 'cash' | 'invoices' | 'ledger';
export type HistoryState = 'all' | 'active' | 'completed';
export interface Transaction {
  type: number; status: number; method: number; currency_from: string | null; currency_to: string | null;
  amount_from: string | null; amount_to: string | null; fee_amount: string | null; fee_currency: string | null;
  created_at: string; completed_at: string | null; error_code: string | null;
  details: { payment_link?: string | null; recipient?: string | null; address?: string; txid?: string | null } | null;
}
export interface Payout {
  type: 'cash' | 'invoice'; status: 'in_progress' | 'completed' | 'cancelled'; status_label: string;
  country: string; city: string | null; direction: 'buy' | 'sell' | null;
  source_amount: string; target_amount: string; rate_value: string;
  appointment_date: string | null; time_slot: string | null; description: string | null; created_at: string;
}
export interface Ledger {
  reference: string; type: 'credit' | 'reserve' | 'capture' | 'release' | 'refund'; currency: 'USDT';
  amount: string; available_after: string; reserved_after: string; created_at: string;
}
export interface Balance { currency: 'USDT'; available: string; reserved: string; total: string; is_frozen: boolean }
export interface ReferralProfile {
  code: string; currency: 'USDT'; earned_amount: string; pending_amount: string;
  cancelled_amount: string; repaid_amount?: string | null; debt_amount?: string | null;
  balance?: ReferralBalance | null;
  program?: { value: string | null; basis: 'merchant_commission'; enabled: boolean;
    levels?: { first: string | null; second: string | null } } | null;
}
export interface ReferralBalance extends Balance {
  network: string; pending_rewards: string; minimum_withdrawal: string; withdrawal_fee: string; kyc_verified: boolean;
}
export interface Relation { created_at: string; transactions_count: number; transactions_sum: string; currency: 'USDT' }
export interface ReferralEntry {
  kind: 'reward' | 'legacy'; currency: 'USDT' | null; amount: string; type: 0 | 1;
  state: 'waiting_source' | 'waiting_account' | 'waiting_review' | 'settled' | 'cancelled' | 'not_earned' | null;
  status: 0 | 1 | 2 | null; created_at: string;
  credited_amount?: string | null; repaid_amount?: string | null; debt_amount?: string | null;
  settled_at?: string | null; cancelled_at?: string | null;
  referred?: { id: string; email?: string } | null;
}
export type Activity = Transaction | Payout | Ledger;
type Obj = Record<string, unknown>;
const object = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string';
const nullable = (v: unknown) => v === null || text(v);
const decimal = (v: unknown): v is string => text(v) && /^\d+(?:\.\d+)?$/.test(v);
const maybeDecimal = (v: unknown) => v === null || decimal(v);
const optionalDecimal = (v: unknown) => v === undefined || maybeDecimal(v);
const date = (v: unknown) => text(v) && Number.isFinite(Date.parse(v));
const integer = (v: unknown, max: number) => Number.isInteger(v) && (v as number) >= 0 && (v as number) <= max;
const strings = (a: Obj, names: string[]) => names.every(k => text(a[k]));
const decimals = (a: Obj, names: string[]) => names.every(k => decimal(a[k]));

function resource<A>(value: unknown, type: string, valid: (a: Obj) => boolean): Resource<A> {
  if (!object(value) || !text(value.id) || !value.id || value.type !== type || !object(value.attributes) || !valid(value.attributes)) throw invalidResponse();
  return value as unknown as Resource<A>;
}
async function get(path: string, query: URLSearchParams, signal?: AbortSignal): Promise<Obj> {
  const body = await requestJson<unknown>(`${path}${query.size ? `?${query}` : ''}`, { signal, cache: 'no-store', retry: 0 }, true);
  if (!object(body) || !('data' in body)) throw invalidResponse();
  return body;
}
function paging(query: URLSearchParams, cursor?: string) {
  if (!cursor) return;
  for (const [key, value] of new URLSearchParams(cursor)) {
    if (/^(page(?:\[(?:size|number|cursor)\])?|cursor)$/.test(key) && value.length <= 1024) query.set(key, value);
  }
}
// Only carry pagination parameters. Never follow an API-supplied host with the user's bearer.
export function nextCursor(body: Obj, path: string): string | null {
  if (!object(body.links) || body.links.next == null) return null;
  if (!text(body.links.next)) throw invalidResponse();
  let url: URL;
  try { url = new URL(body.links.next, 'https://pagination.invalid'); } catch { throw invalidResponse(); }
  if (!url.pathname.endsWith(path)) throw invalidResponse();
  const query = new URLSearchParams();
  paging(query, url.search);
  if (!query.size) throw invalidResponse();
  return query.toString();
}
function page<A>(body: Obj, path: string, type: string, valid: (a: Obj) => boolean): Page<A> {
  if (!Array.isArray(body.data)) throw invalidResponse();
  return { items: body.data.map(item => resource<A>(item, type, valid)), next: nextCursor(body, path) };
}
const validTransaction = (a: Obj) => integer(a.type, 2) && integer(a.method, 2) && integer(a.status, 12)
  && nullable(a.currency_from) && nullable(a.currency_to) && maybeDecimal(a.amount_from) && maybeDecimal(a.amount_to)
  && maybeDecimal(a.fee_amount) && nullable(a.fee_currency) && date(a.created_at) && nullable(a.completed_at)
  && nullable(a.error_code) && (a.details === null || (object(a.details)
    && ['payment_link', 'recipient', 'address', 'txid'].every(k => (a.details as Obj)[k] === undefined || nullable((a.details as Obj)[k]))));
const validPayout = (a: Obj) => ['cash', 'invoice'].includes(String(a.type)) && ['in_progress', 'completed', 'cancelled'].includes(String(a.status))
  && strings(a, ['country', 'status_label']) && decimals(a, ['source_amount', 'target_amount', 'rate_value'])
  && nullable(a.city) && [null, 'buy', 'sell'].includes(a.direction as null | string)
  && nullable(a.appointment_date) && nullable(a.time_slot) && nullable(a.description) && date(a.created_at);
const validLedger = (a: Obj) => ['credit', 'reserve', 'capture', 'release', 'refund'].includes(String(a.type))
  && a.currency === 'USDT' && text(a.reference) && decimals(a, ['amount', 'available_after', 'reserved_after']) && date(a.created_at);
const validReferral = (a: Obj) => ['reward', 'legacy'].includes(String(a.kind)) && [null, 'USDT'].includes(a.currency as null | string)
  && decimal(a.amount) && integer(a.type, 1) && (a.status === null || integer(a.status, 2))
  && [null, 'waiting_source', 'waiting_account', 'waiting_review', 'settled', 'cancelled', 'not_earned'].includes(a.state as null | string)
  && ['credited_amount', 'repaid_amount', 'debt_amount'].every(k => optionalDecimal(a[k]))
  && date(a.created_at) && (a.settled_at === undefined || nullable(a.settled_at)) && (a.cancelled_at === undefined || nullable(a.cancelled_at))
  && (a.referred == null || (object(a.referred) && text(a.referred.id) && (a.referred.email === undefined || text(a.referred.email))));
const validRelation = (a: Obj) => date(a.created_at) && Number.isInteger(a.transactions_count) && (a.transactions_count as number) >= 0
  && decimal(a.transactions_sum) && a.currency === 'USDT';
export const activeStatuses = [0, 1, 4, 5, 11, 12];
export function transactionActive(status: number) { return activeStatuses.includes(status); }

export async function fetchHistory(kind: HistoryKind, state: HistoryState = 'all', cursor?: string, signal?: AbortSignal): Promise<Page<Activity>> {
  const path = kind === 'transactions' ? '/api/transactions' : kind === 'ledger' ? '/api/balance/history' : `/api/payouts/${kind}`;
  const query = new URLSearchParams();
  if (kind === 'transactions') {
    query.set('page[size]', '15'); query.set('filter[sort]', '-created_at');
    if (state !== 'all') for (let n = 0; n <= 12; n++) if (transactionActive(n) === (state === 'active')) query.append('filter[status][]', String(n));
  }
  paging(query, cursor);
  const body = await get(path, query, signal);
  if (kind === 'transactions') return page<Transaction>(body, path, 'transactions', validTransaction);
  if (kind === 'ledger') {
    if (!Array.isArray(body.data)) throw invalidResponse();
    const items = body.data.map(item => {
      if (!object(item) || !text(item.id) || !validLedger(item)) throw invalidResponse();
      return { id: item.id, type: 'ledger', attributes: item as unknown as Ledger };
    });
    return { items, next: nextCursor(body, path) };
  }
  return page<Payout>(body, path, 'payouts', a => validPayout(a) && a.type === (kind === 'cash' ? 'cash' : 'invoice'));
}
export async function fetchOrder(kind: Exclude<HistoryKind, 'ledger'>, id: string, signal?: AbortSignal): Promise<Resource<Transaction | Payout>> {
  if (!/^[1-9]\d*$/.test(id)) throw invalidResponse();
  const path = kind === 'transactions' ? `/api/transactions/${id}` : `/api/payouts/${kind}/${id}`;
  const body = await get(path, new URLSearchParams(), signal);
  return kind === 'transactions' ? resource<Transaction>(body.data, 'transactions', validTransaction)
    : resource<Payout>(body.data, 'payouts', a => validPayout(a) && a.type === (kind === 'cash' ? 'cash' : 'invoice'));
}
export async function fetchBalance(signal?: AbortSignal): Promise<Balance> {
  const { data } = await get('/api/balance', new URLSearchParams(), signal);
  if (!object(data) || data.currency !== 'USDT' || !decimals(data, ['available', 'reserved', 'total']) || typeof data.is_frozen !== 'boolean') throw invalidResponse();
  return data as unknown as Balance;
}
export async function fetchReferralProfile(signal?: AbortSignal) {
  const body = await get('/api/referrals/me', new URLSearchParams(), signal);
  return resource<ReferralProfile>(body.data, 'referral', a => a.currency === 'USDT' && text(a.code)
    && decimals(a, ['earned_amount', 'pending_amount', 'cancelled_amount'])
    && optionalDecimal(a.repaid_amount) && optionalDecimal(a.debt_amount)
    && (a.balance == null || (object(a.balance) && a.balance.currency === 'USDT' && text(a.balance.network)
      && decimals(a.balance, ['available', 'reserved', 'total', 'pending_rewards', 'minimum_withdrawal', 'withdrawal_fee'])
      && typeof a.balance.is_frozen === 'boolean' && typeof a.balance.kyc_verified === 'boolean'))
    && (a.program == null || (object(a.program) && maybeDecimal(a.program.value) && a.program.basis === 'merchant_commission'
      && typeof a.program.enabled === 'boolean' && (a.program.levels === undefined || (object(a.program.levels)
        && maybeDecimal(a.program.levels.first) && maybeDecimal(a.program.levels.second))))));
}
export async function fetchRelations(signal?: AbortSignal) {
  const body = await get('/api/referrals/relations', new URLSearchParams(), signal);
  if (!Array.isArray(body.data) || !object(body.meta) || !Number.isInteger(body.meta.total) || (body.meta.total as number) < 0) throw invalidResponse();
  return { items: body.data.map(item => resource<Relation>(item, 'referral_relations', validRelation)), total: body.meta.total as number };
}
export async function fetchReferralProfit(from = '', to = '', signal?: AbortSignal) {
  const query = new URLSearchParams();
  if (from) query.set('filter[date_from]', from);
  if (to) query.set('filter[date_to]', to);
  const { data } = await get('/api/referrals/profit', query, signal);
  if (!object(data) || !decimal(data.value) || data.currency !== 'USDT') throw invalidResponse();
  return { value: data.value, currency: 'USDT' };
}
export async function fetchReferralCommission(signal?: AbortSignal) {
  const { data } = await get('/api/referrals/commission', new URLSearchParams(), signal);
  if (!object(data) || !(data.value === null || decimal(data.value)) || data.basis !== 'merchant_commission' || typeof data.enabled !== 'boolean') throw invalidResponse();
  return { value: data.value as string | null, enabled: data.enabled };
}
export async function fetchReferralHistory(cursor?: string, signal?: AbortSignal) {
  const path = '/api/referrals/transactions';
  const query = new URLSearchParams({ 'page[size]': '15', 'filter[sort]': '-created_at' });
  paging(query, cursor);
  return page<ReferralEntry>(await get(path, query, signal), path, 'referral_transactions', validReferral);
}
export async function fetchReferralEntry(id: string, signal?: AbortSignal) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) throw invalidResponse();
  const body = await get(`/api/referrals/transactions/${id}`, new URLSearchParams(), signal);
  return resource<ReferralEntry>(body.data, 'referral_transactions', validReferral);
}
