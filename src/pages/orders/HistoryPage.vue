<template>
  <q-page class="history-page">
    <main class="history-screen" aria-label="История">
      <header class="history-header">
        <button class="history-back" type="button" aria-label="Назад" @click="goBack">
          <span class="history-back__arrow" aria-hidden="true" />
        </button>

        <h1 class="history-title">История</h1>

        <button class="history-filter" type="button" aria-label="Фильтр">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6h16M7 12h10M10 18h4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </header>

      <UiTabs
        v-model="activeTab"
        class="history-tabs"
        :options="tabs"
        aria-label="Фильтр истории"
      />

      <section class="history-list" aria-label="Список операций">
        <WalletOperationRow
          v-for="op in operations"
          :key="op.id"
          :direction="op.direction"
          :title="op.title"
          :subtitle="op.subtitle"
          :amount="op.amount"
          :tone="op.tone"
          :date="op.date"
        />
      </section>

      <div v-if="showLoadMore" class="history-load-more">
        <button
          class="history-load-more__button"
          type="button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          Показать еще
        </button>
      </div>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import UiTabs, { type UiTabOption } from 'components/ui/UiTabs.vue';
import WalletOperationRow from 'components/wallet/WalletOperationRow.vue';
import { type HistoryOperationView } from '@/mocks/payments/adapters';
import { usePaymentsStore } from '@/stores/payments-store';

defineOptions({
  name: 'HistoryPage',
});

type HistoryTab = 'withdraw' | 'deposit';

const router = useRouter();
const paymentsStore = usePaymentsStore();

const activeTab = ref<HistoryTab>('withdraw');
const tabs: UiTabOption[] = [
  { label: 'Вывод', value: 'withdraw' },
  { label: 'Пополнение', value: 'deposit' },
];

const pageSize = 15;
const operations = ref<HistoryOperationView[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const loadingMore = ref(false);

const showLoadMore = computed(() => currentPage.value < lastPage.value);

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/wallet');
}

async function loadInitial() {
  operations.value = [];
  currentPage.value = 1;
  const items = paymentsStore.historyByType(activeTab.value === 'withdraw' ? 1 : 0);
  operations.value = items.slice(0, pageSize);
  lastPage.value = Math.max(1, Math.ceil(items.length / pageSize));
}

async function loadMore() {
  if (!showLoadMore.value || loadingMore.value) return;
  loadingMore.value = true;
  try {
    const nextPage = currentPage.value + 1;
    const items = paymentsStore.historyByType(activeTab.value === 'withdraw' ? 1 : 0);
    operations.value = items.slice(0, nextPage * pageSize);
    currentPage.value = nextPage;
    lastPage.value = Math.max(1, Math.ceil(items.length / pageSize));
  } finally {
    loadingMore.value = false;
  }
}

watch(activeTab, () => {
  void loadInitial();
}, { immediate: true });
</script>

<style scoped lang="scss">
.history-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.history-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(16px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.history-header {
  height: 44px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  column-gap: 12px;
}

.history-back {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 9px 0 rgb(0 0 0 / 5%);
  color: var(--ui-text-muted);
  cursor: pointer;
}

.history-back:active {
  transform: translateY(1px);
}

.history-back:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.history-back__arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(1px) rotate(135deg);
}

.history-title {
  margin: 0;
  text-align: center;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: 0;
}

.history-filter {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-brand);
  cursor: pointer;
}

.history-filter:active {
  transform: translateY(1px);
}

.history-filter:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.history-tabs {
  margin-top: 12px;
}

.history-list {
  margin-top: 22px;
  display: grid;
  gap: 18px;
}

.history-load-more {
  margin-top: 34px;
  display: grid;
  place-items: center;
}

.history-load-more__button {
  width: 250px;
  max-width: 100%;
  height: 50px;
  padding: 10px;
  border: 0;
  border-radius: 20px;
  background: var(--ui-text-neutral);
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-button);
  line-height: var(--ui-line-button);
  font-weight: 600;
  letter-spacing: 0;
  cursor: pointer;
  transition: opacity 160ms ease, transform 160ms ease;
}

.history-load-more__button:active:not(:disabled) {
  transform: translateY(1px);
}

.history-load-more__button:disabled {
  opacity: 0.7;
  cursor: default;
}
</style>
