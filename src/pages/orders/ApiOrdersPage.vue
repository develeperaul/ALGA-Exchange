<template>
  <ApiPageShell :title="initialKind === 'ledger' ? 'История' : 'Мои заявки'">
    <template #actions><RouterLink :to="initialKind === 'ledger' ? '/orders' : '/orders/history'">{{ initialKind === 'ledger' ? 'Заявки' : 'Движение средств' }}</RouterLink></template>
    <label class="api-field">Раздел
      <select v-model="kind" aria-label="Раздел истории">
        <option value="transactions">Безналичные операции</option><option value="cash">Наличный обмен</option>
        <option value="invoices">Инвойсы</option><option value="ledger">Движение средств USDT</option>
      </select>
    </label>
    <UiTabs v-if="kind !== 'ledger'" v-model="state" :options="tabs" aria-label="Статус заявок" />
    <UiButton size="mini" variant="neutral" :disabled="loading" @click="refresh">Обновить</UiButton>
    <ApiReadState :loading="loading" :error="error" @retry="retry" />
    <section v-if="!loading && !error && visibleItems.length === 0" class="api-card" role="status">
      <p>{{ next ? 'На загруженных страницах записей с таким статусом нет.' : 'Записей пока нет.' }}</p>
    </section>
    <section class="api-list" aria-label="История операций">
      <template v-for="item in visibleItems" :key="item.id">
        <article v-if="kind === 'ledger'" class="api-card">
          <h2>{{ ledgerLabels[(item.attributes as Ledger).type] }}</h2>
          <p>{{ money((item.attributes as Ledger).amount, 'USDT') }}</p>
          <p class="api-meta">{{ displayDate(item.attributes.created_at) }}</p>
          <p>Доступно после: {{ money((item.attributes as Ledger).available_after, 'USDT') }}</p>
          <p>В резерве после: {{ money((item.attributes as Ledger).reserved_after, 'USDT') }}</p>
          <p class="api-meta">{{ (item.attributes as Ledger).reference }}</p>
        </article>
        <RouterLink v-else :to="{ path: `/orders/${item.id}`, query: { kind } }" class="api-card-link">
          <OrderRequestCard :status="cardStatus(item.attributes)" :status-text="statusText(item.attributes)"
            :title="activityTitle(kind, item.attributes)" :subtitle="`№${item.id}`"
            :date="displayDate(item.attributes.created_at)" :amount="amountText(item.attributes)" />
        </RouterLink>
      </template>
    </section>
    <UiButton v-if="next && !error" :disabled="loading" @click="loadMore">Показать ещё</UiButton>
    <p v-if="kind === 'ledger'" class="api-meta">Резервирование и списание из резерва — разные события одной операции.</p>
  </ApiPageShell>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import ApiPageShell from 'components/common/ApiPageShell.vue';
import ApiReadState from 'components/common/ApiReadState.vue';
import OrderRequestCard from 'components/orders/OrderRequestCard.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiTabs from 'components/ui/UiTabs.vue';
import { fetchHistory, transactionActive, type Activity, type HistoryKind, type HistoryState, type Ledger, type Payout, type Transaction } from '@/api/activity';
import { useSessionList } from '@/composables/useSessionList';
import { activityTitle, displayDate, ledgerLabels, money, transactionStatus } from '@/utils/activity-view';

const props = withDefaults(defineProps<{ initialKind?: HistoryKind }>(), { initialKind: 'transactions' });
const kind = ref<HistoryKind>(props.initialKind);
const state = ref<HistoryState>('all');
watch(() => props.initialKind, value => { kind.value = value; state.value = 'all'; });
const tabs = [{ label: 'Все', value: 'all' }, { label: 'Активные', value: 'active' }, { label: 'Завершённые', value: 'completed' }];
const { items, next, loading, error, refresh, retry, loadMore } = useSessionList(
  () => `history:${kind.value}:${state.value}`, (cursor, signal) => fetchHistory(kind.value, state.value, cursor, signal));
const visibleItems = computed(() => items.value.filter(item => kind.value === 'ledger' || kind.value === 'transactions' || state.value === 'all'
  || (((item.attributes as Payout).status === 'in_progress') === (state.value === 'active'))));
function cardStatus(a: Activity): 'processing' | 'completed' | 'cancelled' {
  if (kind.value === 'transactions') return transactionActive((a as Transaction).status) ? 'processing' : (a as Transaction).status === 2 ? 'completed' : 'cancelled';
  const status = (a as Payout).status;
  return status === 'in_progress' ? 'processing' : status;
}
function statusText(a: Activity) { return kind.value === 'transactions' ? transactionStatus((a as Transaction).status) : (a as Payout).status_label; }
function amountText(a: Activity) { return kind.value === 'transactions' ? money((a as Transaction).amount_to, (a as Transaction).currency_to) : money((a as Payout).source_amount, 'USDT'); }
</script>
