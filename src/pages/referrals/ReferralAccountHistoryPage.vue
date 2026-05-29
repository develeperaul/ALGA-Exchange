<template>
  <q-page class="ref-history-page">
    <main class="ref-history" aria-label="История">
      <header class="ref-history__header">
        <button class="ref-history__back" type="button" aria-label="Назад" @click="goBack">
          <span class="ref-history__back-arrow" aria-hidden="true" />
        </button>

        <h1 class="ref-history__title">
          История
        </h1>

        <button class="ref-history__filter" type="button" aria-label="Фильтр">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </header>

      <UiTabs
        v-model="activeTab"
        class="ref-history__tabs"
        :options="tabs"
        aria-label="Фильтр истории"
      />

      <section class="ref-history__list" aria-label="Список операций">
        <ReferralOperationRow
          v-for="operation in visibleOperations"
          :key="operation.id"
          :title="operation.title"
          :date="operation.date"
          :amount="operation.amount"
          @select="openOperation(operation)"
        />
      </section>

      <div class="ref-history__more">
        <button class="ref-history__more-button" type="button">
          Показать еще
        </button>
      </div>
    </main>

    <ReferralOperationDetailsModal
      v-model="showOperationModal"
      :operation="selectedOperationDetails"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import UiTabs, { type UiTabOption } from 'components/ui/UiTabs.vue';
import ReferralOperationRow from 'components/referrals/ReferralOperationRow.vue';
import ReferralOperationDetailsModal, { type ReferralOperationDetails } from 'components/modals/ReferralOperationDetailsModal.vue';

defineOptions({
  name: 'ReferralAccountHistoryPage',
});

type ReferralHistoryTab = 'accrual' | 'withdraw';

interface ReferralHistoryOperation {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: ReferralHistoryTab;
  referralId: string;
}

const router = useRouter();
const activeTab = ref<ReferralHistoryTab>('accrual');
const showOperationModal = ref(false);
const selectedOperation = ref<ReferralHistoryOperation | null>(null);

const tabs: UiTabOption[] = [
  { label: 'Начисление', value: 'accrual' },
  { label: 'Вывод', value: 'withdraw' },
];

const operations: ReferralHistoryOperation[] = [
  { id: '1', type: 'accrual', title: 'Начисление', date: '8 фев. 2026 г.', amount: '+0,88 USDT', referralId: '010205' },
  { id: '2', type: 'accrual', title: 'Начисление', date: '31 янв. 2026 г.', amount: '+3 USDT', referralId: '851066' },
  { id: '3', type: 'accrual', title: 'Начисление', date: '20 янв. 2026 г.', amount: '+0,88 USDT', referralId: '247710' },
  { id: '4', type: 'accrual', title: 'Начисление', date: '1 янв. 2026 г.', amount: '+3,2 USDT', referralId: '010205' },
  { id: '5', type: 'accrual', title: 'Начисление', date: '8 фев. 2026 г.', amount: '+0,88 USDT', referralId: '851066' },
  { id: '6', type: 'accrual', title: 'Начисление', date: '31 янв. 2026 г.', amount: '+3 USDT', referralId: '247710' },
  { id: '7', type: 'accrual', title: 'Начисление', date: '20 янв. 2026 г.', amount: '+0,88 USDT', referralId: '010205' },
  { id: '8', type: 'accrual', title: 'Начисление', date: '1 янв. 2026 г.', amount: '+3,2 USDT', referralId: '851066' },
  { id: '9', type: 'withdraw', title: 'Вывод', date: '5 янв. 2026 г.', amount: '-12 USDT', referralId: '010205' },
];

const visibleOperations = computed(() => operations.filter((operation) => operation.type === activeTab.value));
const selectedOperationDetails = computed<ReferralOperationDetails | null>(() => {
  if (!selectedOperation.value) return null;

  return {
    type: selectedOperation.value.title,
    date: selectedOperation.value.date,
    amount: selectedOperation.value.amount,
    referralId: selectedOperation.value.referralId,
  };
});

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/referrals/account');
}

function openOperation(operation: ReferralHistoryOperation) {
  selectedOperation.value = operation;
  showOperationModal.value = true;
}
</script>

<style scoped lang="scss">
.ref-history-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.ref-history {
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

.ref-history__header {
  height: 44px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  column-gap: 12px;
}

.ref-history__back,
.ref-history__filter {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.ref-history__back {
  border-radius: 50%;
  background: var(--ui-surface-white);
}

.ref-history__filter {
  color: var(--ui-text-brand);
}

.ref-history__back-arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(1px) rotate(135deg);
}

.ref-history__title {
  margin: 0;
  text-align: center;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-history__tabs {
  margin-top: 53px;
}

.ref-history__list {
  margin-top: 22px;
  display: grid;
  gap: 10px;
}

.ref-history__more {
  margin-top: 24px;
  display: grid;
  place-items: center;
}

.ref-history__more-button {
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
  letter-spacing: -0.3px;
  cursor: pointer;
}
</style>
