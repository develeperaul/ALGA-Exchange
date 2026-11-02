<template>
  <section class="api-transaction" aria-label="Создать операцию">
    <h2>Новая операция</h2>
    <label>Тип операции
      <select v-model="kind" :disabled="!!pending || !!createdId">
        <option value="buy">Купить USDT через СБП</option>
        <option value="sell-card">Продать USDT на карту</option>
        <option value="sell-sbp">Продать USDT по СБП</option>
        <option value="transfer">Перевести USDT в сети TRON</option>
      </select>
    </label>
    <template v-if="kind !== 'transfer'">
      <p v-if="loading">Загрузка котировок…</p>
      <label>Котировка
        <select v-model="quoteId" :disabled="!!pending || !!createdId || loading">
          <option value="">Выберите актуальную котировку</option>
          <option v-for="quote in currentQuotes" :key="quote.quote_id" :value="quote.quote_id">
            {{ quote.rate }} RUB/USDT · {{ quote.method === 'card' ? 'карта' : 'СБП' }} · до {{ new Date(quote.expires_at).toLocaleTimeString() }}
          </option>
        </select>
      </label>
      <button type="button" :disabled="loading || !!pending || !!createdId" @click="loadQuotes">Обновить котировки</button>
    </template>
    <label>{{ kind.startsWith('sell') ? 'Сумма получения, RUB' : 'Сумма получения, USDT' }}
      <input v-model.trim="amount" inputmode="decimal" :disabled="!!pending || !!createdId" placeholder="0.00" />
      <span class="api-transaction__hint">{{ amountHint }}</span>
    </label>
    <label v-if="kind === 'sell-card'">Номер карты
      <input v-model.trim="pan" inputmode="numeric" autocomplete="off" :disabled="!!pending || !!createdId" />
    </label>
    <template v-if="kind === 'sell-sbp'">
      <label>Телефон СБП
        <input v-model.trim="phone" inputmode="tel" autocomplete="off" :disabled="!!pending || !!createdId" placeholder="+7…" />
      </label>
      <label>Цифровой код банка СБП
        <input v-model.trim="bank" inputmode="numeric" autocomplete="off" :disabled="!!pending || !!createdId" />
      </label>
    </template>
    <label v-if="kind === 'transfer'">TRON-адрес получателя
      <input v-model.trim="address" autocomplete="off" :disabled="!!pending || !!createdId" />
    </label>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="createdId" role="status">Операция №{{ createdId }} принята в обработку. Финансовый результат уточняется в истории операций.</p>
    <UiButton :disabled="submitting || !!createdId || (!pending && (loading || (kind !== 'transfer' && !selected)))" @click="submit">
      {{ submitting ? 'Отправка…' : pending ? 'Повторить тот же запрос' : 'Создать операцию' }}
    </UiButton>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import UiButton from 'components/ui/UiButton.vue';
import { createTransaction, fetchOperationQuotes, selectedQuote, validAmount, type TransactionInput } from '@/api/operations';
import type { SharedQuote } from '@/api/quotes';
import { useAuthStore } from '@/stores/auth-store';
import { getSessionScope, isCurrentSession, onSessionChange } from '@/api/session';
import { ApiError } from '@/api/errors';

const auth = useAuthStore();
type Kind = 'buy' | 'sell-card' | 'sell-sbp' | 'transfer';
const kind = ref<Kind>('buy');
const quotes = ref<SharedQuote[]>([]);
const quoteId = ref('');
const amount = ref('');
const pan = ref('');
const phone = ref('');
const bank = ref('');
const address = ref('');
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const createdId = ref('');
const now = ref(Date.now());
const pending = ref<{ body: TransactionInput; key: string; epoch: number } | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;
let loadSerial = 0;
let disposed = false;
let quotesController: AbortController | null = null;
let transactionController: AbortController | null = null;
const current = (epoch: number) => !disposed && isCurrentSession(epoch);
const currentQuotes = computed(() => quotes.value.filter(q => Date.parse(q.expires_at) > now.value));
const selected = computed(() => selectedQuote(currentQuotes.value, quoteId.value));
const amountLimits = computed(() => kind.value === 'sell-card'
  ? { min: '3000', max: 100000, precision: 2, currency: 'RUB' }
  : kind.value === 'sell-sbp'
    ? { min: '1000', max: 60000, precision: 2, currency: 'RUB' }
    : { min: '0.000001', max: null, precision: 6, currency: 'USDT' });
const amountHint = computed(() => {
  const limits = amountLimits.value;
  return `От ${limits.min}${limits.max === null ? '' : ` до ${limits.max}`} ${limits.currency}; до ${limits.precision} знаков после точки.`;
});

async function loadQuotes() {
  if (disposed || kind.value === 'transfer') return;
  quotesController?.abort();
  const controller = new AbortController();
  quotesController = controller;
  const serial = ++loadSerial;
  const epoch = getSessionScope().epoch;
  const currentKind = kind.value;
  const type = currentKind === 'buy' ? 'buy' : 'sell';
  const method = currentKind === 'sell-card' ? 'card' : 'sbp';
  loading.value = true; error.value = ''; quoteId.value = ''; quotes.value = [];
  try {
    const result = await fetchOperationQuotes(type, method, controller.signal);
    if (current(epoch) && serial === loadSerial && kind.value === currentKind) quotes.value = result;
  } catch (cause) {
    if (current(epoch) && serial === loadSerial && !controller.signal.aborted) error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить котировки';
  } finally { if (current(epoch) && serial === loadSerial) loading.value = false; }
}
watch(kind, () => { if (!pending.value) void loadQuotes(); });
function clearSensitiveState() {
  ++loadSerial;
  quotesController?.abort(); transactionController?.abort();
  quotesController = null; transactionController = null;
  pending.value = null; createdId.value = ''; quotes.value = []; quoteId.value = '';
  amount.value = ''; pan.value = ''; phone.value = ''; bank.value = ''; address.value = '';
  error.value = ''; loading.value = false; submitting.value = false;
}
const unsubscribe = onSessionChange(clearSensitiveState);
onMounted(() => {
  void loadQuotes();
  timer = setInterval(() => { now.value = Date.now(); }, 5000);
  document.addEventListener('visibilitychange', updateNow);
});
onUnmounted(() => {
  disposed = true;
  if (timer) clearInterval(timer);
  document.removeEventListener('visibilitychange', updateNow);
  unsubscribe(); clearSensitiveState();
});
function updateNow() { now.value = Date.now(); }

async function submit() {
  if (disposed || submitting.value || createdId.value) return;
  error.value = '';
  if (!auth.isAuthenticated || auth.verificationStatus !== 'approved') {
    error.value = 'Для операции нужны авторизация и подтверждённый KYC'; return;
  }
  if (pending.value && pending.value.epoch !== getSessionScope().epoch) pending.value = null;
  if (!pending.value) {
    const sum = amount.value;
    const limits = amountLimits.value;
    if (!validAmount(sum, '0.000001', limits.precision)) {
      error.value = `Введите положительную сумму: до ${limits.precision} знаков после точки.`; return;
    }
    if (!validAmount(sum, limits.min, limits.precision)) {
      error.value = `Минимальная сумма — ${limits.min} ${limits.currency}. Запрос не отправлен.`; return;
    }
    if (limits.max !== null && Number(sum) > limits.max) {
      error.value = `Максимальная сумма — ${limits.max} ${limits.currency}. Запрос не отправлен.`; return;
    }
    let body: TransactionInput;
    if (kind.value === 'transfer') {
      if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.value)) { error.value = 'Укажите TRON-адрес'; return; }
      body = { type: 'transfer', amount_to: sum, address: address.value };
    } else {
      const quote = selected.value;
      if (!quote || Date.parse(quote.expires_at) <= Date.now()) { error.value = 'Котировка истекла. Обновите её'; return; }
      if (kind.value === 'buy') body = { type: 'buy', quote_id: quote.quote_id, amount_to: sum };
      else if (kind.value === 'sell-card') {
        if (!/^\d{13,19}$/.test(pan.value)) { error.value = 'Проверьте номер карты'; return; }
        body = { type: 'sell', quote_id: quote.quote_id, amount_to: sum, recipient: { pan: pan.value } };
      } else {
        if (!/^\+?7\d{10}$/.test(phone.value) || !/^\d{1,32}$/.test(bank.value)) { error.value = 'Проверьте телефон и код банка'; return; }
        body = { type: 'sell', quote_id: quote.quote_id, amount_to: sum, recipient: { phone: phone.value, bank: bank.value } };
      }
    }
    pending.value = { body, key: crypto.randomUUID(), epoch: getSessionScope().epoch };
  }
  const attempt = pending.value;
  if (!attempt) return;
  const controller = new AbortController();
  transactionController = controller;
  submitting.value = true;
  try {
    const id = await createTransaction(attempt.body, attempt.key, controller.signal);
    if (current(attempt.epoch)) { createdId.value = id; pending.value = null; }
  } catch (cause) {
    if (current(attempt.epoch)) {
      error.value = cause instanceof Error ? cause.message : 'Не удалось определить результат. Повторите тот же запрос.';
      if (cause instanceof ApiError && [400, 401, 403, 404, 409, 410, 422].includes(cause.status ?? -1)) {
        pending.value = null;
        if (cause.status === 410) { quoteId.value = ''; quotes.value = []; error.value += ' Обновите котировку и подтвердите новые условия.'; }
      }
    }
  } finally { if (current(attempt.epoch)) { submitting.value = false; transactionController = null; } }
}
</script>

<style scoped lang="scss">
.api-transaction { margin-top: 24px; padding: 20px; border-radius: 24px; background: var(--ui-surface-white); display: grid; gap: 16px; }
.api-transaction h2 { margin: 0; font-size: var(--ui-font-h2); }
.api-transaction label { display: grid; gap: 8px; }
.api-transaction input, .api-transaction select { width: 100%; min-height: 48px; border: 1px solid var(--ui-border-focus); border-radius: 14px; padding: 8px 12px; background: var(--ui-surface-page); color: var(--ui-text-primary); }
.api-transaction p { margin: 0; }
.api-transaction__hint { color: var(--ui-text-secondary); font-size: var(--ui-font-t2); }
</style>
