import type { Activity, HistoryKind, Payout, Transaction } from '@/api/activity';

export function displayDate(value: string | null | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return '—';
  return new Date(value).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' });
}
export function money(value: string | null | undefined, currency: string | null | undefined) {
  return value == null ? '—' : `${value}${currency ? ` ${currency}` : ''}`;
}
const transactionStates = ['В очереди', 'В обработке', 'Исполнена', 'Отклонена', 'Ожидает оплаты', 'Приостановлена',
  'Проверка безопасности не пройдена', 'Ошибка банка', 'Возвращена', 'Ошибка создания', 'Время ожидания истекло',
  'Требуется сверка', 'Запрошен возврат'];
export function transactionStatus(status: number) { return transactionStates[status] ?? 'Неизвестный статус'; }
export function activityTitle(kind: HistoryKind, a: Activity) {
  if (kind === 'transactions') return ['Покупка USDT', 'Продажа USDT', 'Перевод USDT'][(a as Transaction).type];
  if (kind === 'cash') return (a as Payout).direction === 'buy' ? 'Наличные: покупка USDT' : 'Наличные: продажа USDT';
  return kind === 'invoices' ? 'Оплата инвойса' : 'Движение средств';
}
export const ledgerLabels: Record<string, string> = {
  credit: 'Зачисление', reserve: 'Резервирование', capture: 'Списание из резерва', release: 'Снятие резерва', refund: 'Возврат',
};
export const referralStates: Record<string, string> = {
  waiting_source: 'Ожидает завершения исходной операции', waiting_account: 'Ожидает зачисления',
  waiting_review: 'Требуется сверка', settled: 'Распределена', cancelled: 'Отменена', not_earned: 'Не заработана',
};
export function safePaymentUrl(value: unknown) {
  if (typeof value !== 'string') return '';
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
  catch { return ''; }
}
