<template>
  <ApiPageShell title="Детали операции">
    <template #actions><RouterLink to="/orders">К заявкам</RouterLink></template>
    <ApiReadState :loading="loading" :error="error" @retry="refresh" />
    <template v-if="data">
      <section class="api-card">
        <h2>{{ activityTitle(kind, data.attributes) }}</h2>
        <p>№{{ data.id }}</p><p>{{ status }}</p>
        <p class="api-meta">{{ displayDate(data.attributes.created_at) }}</p>
        <dl><div v-for="field in fields" :key="field[0]"><dt>{{ field[0] }}</dt><dd>{{ field[1] }}</dd></div></dl>
        <a v-if="paymentUrl" :href="paymentUrl" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Перейти к оплате</a>
      </section>
      <UiButton size="mini" :disabled="loading" @click="refresh">Обновить статус</UiButton>
    </template>
  </ApiPageShell>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import ApiPageShell from 'components/common/ApiPageShell.vue';
import ApiReadState from 'components/common/ApiReadState.vue';
import UiButton from 'components/ui/UiButton.vue';
import { fetchOrder, type Payout, type Transaction } from '@/api/activity';
import { useSessionRead } from '@/composables/useSessionRead';
import { activityTitle, displayDate, money, safePaymentUrl, transactionStatus } from '@/utils/activity-view';
const route = useRoute();
const kind = computed(() => route.query.kind === 'cash' ? 'cash' : route.query.kind === 'invoices' ? 'invoices' : 'transactions');
const { data, loading, error, refresh } = useSessionRead(() => `order:${kind.value}:${String(route.params.id)}`,
  signal => fetchOrder(kind.value, String(route.params.id), signal));
const status = computed(() => !data.value ? '' : kind.value === 'transactions' ? transactionStatus((data.value.attributes as Transaction).status) : (data.value.attributes as Payout).status_label);
const fields = computed(() => {
  if (!data.value) return [];
  if (kind.value === 'transactions') {
    const a = data.value.attributes as Transaction;
    return [['Сумма отправления', money(a.amount_from, a.currency_from)], ['Сумма получения', money(a.amount_to, a.currency_to)],
      ['Комиссия (уже учтена)', money(a.fee_amount, a.fee_currency)], ['Способ', ['Карта', 'СБП', 'TRON'][a.method]],
      ['Завершение', displayDate(a.completed_at)], ['Код ошибки', a.error_code ?? '—'],
      ['Получатель', a.details?.recipient ?? a.details?.address ?? '—'], ['ID перевода в сети', a.details?.txid ?? '—']];
  }
  const a = data.value.attributes as Payout;
  return [['Сумма USDT', money(a.source_amount, 'USDT')], ['Расчётная сумма RUB', money(a.target_amount, 'RUB')],
    ['Курс при создании', a.rate_value], ['Страна', a.country], ['Город', a.city ?? '—'],
    ['Дата встречи', a.appointment_date ?? '—'], ['Время встречи', a.time_slot ?? '—'], ['Описание', a.description ?? '—']];
});
const paymentUrl = computed(() => data.value && kind.value === 'transactions' ? safePaymentUrl((data.value.attributes as Transaction).details?.payment_link) : '');
</script>
