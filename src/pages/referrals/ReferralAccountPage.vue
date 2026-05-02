<template>
  <q-page class="ref-account-page">
    <main class="ref-account" aria-label="Баланс реферального счета">
      <header class="ref-account__header">
        <button class="ref-account__back" type="button" aria-label="Назад" @click="goBack">
          <span class="ref-account__back-arrow" aria-hidden="true" />
        </button>

        <h1 class="ref-account__title">
          Баланс реферального счета
        </h1>

        <button class="ref-account__info" type="button" aria-label="Информация">
          <q-icon name="info" size="18px" />
        </button>
      </header>

      <section class="ref-account__balance" aria-label="Баланс">
        <p class="ref-account__amount">{{ balanceText }}</p>
        <UiButton class="ref-account__withdraw" size="mini">
          Вывести
        </UiButton>
      </section>

      <header class="ref-account__section-header">
        <h2 class="ref-account__section-title">
          Последние операции
        </h2>
        <button v-if="hasOperations" class="ref-account__history" type="button" @click="goToHistory">
          История
        </button>
      </header>

      <UiTabs
        v-model="activeTab"
        class="ref-account__tabs"
        :options="tabs"
        aria-label="Операции реферального счета"
      />

      <section v-if="hasOperations" class="ref-account__ops" aria-label="Последние операции">
        <ReferralOperationRow
          v-for="operation in operations"
          :key="operation.id"
          :title="operation.title"
          :date="operation.date"
          :amount="operation.amount"
        />
      </section>

      <section v-else class="ref-account__empty" aria-live="polite">
        <img class="ref-account__empty-image" :src="walletImage" alt="" aria-hidden="true">
        <p class="ref-account__empty-text">
          Здесь будет история списания средств
        </p>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import UiTabs, { type UiTabOption } from 'components/ui/UiTabs.vue';
import ReferralOperationRow from 'components/referrals/ReferralOperationRow.vue';
import walletImage from 'assets/wallet.png';

defineOptions({
  name: 'ReferralAccountPage',
});

type ReferralAccountTab = 'accrual' | 'withdraw';

interface ReferralOperation {
  id: string;
  title: string;
  date: string;
  amount: string;
}

const route = useRoute();
const router = useRouter();
const activeTab = ref<ReferralAccountTab>('withdraw');

const tabs: UiTabOption[] = [
  { label: 'Начисление', value: 'accrual' },
  { label: 'Вывод', value: 'withdraw' },
];

const mockOperations: ReferralOperation[] = [
  { id: '1', title: 'Начисление', date: '8 фев. 2026 г.', amount: '+0,88 USDT' },
  { id: '2', title: 'Начисление', date: '31 янв. 2026 г.', amount: '+3 USDT' },
];

const operations = computed(() => (route.query.empty === '1' ? [] : mockOperations));
const hasOperations = computed(() => operations.value.length > 0);
const balanceText = computed(() => (hasOperations.value ? '0,88 USDT' : '0 USDT'));

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/referrals');
}

function goToHistory() {
  void router.push('/referrals/account/history');
}
</script>

<style scoped lang="scss">
.ref-account-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.ref-account {
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

.ref-account__header {
  height: 44px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 32px;
  align-items: center;
  column-gap: 8px;
}

.ref-account__title {
  margin: 0;
  text-align: center;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-account__back,
.ref-account__info {
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

.ref-account__back-arrow {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(1px) rotate(135deg);
}

.ref-account__balance {
  height: 130px;
  margin-top: 52px;
  padding: 22px 0 21px;
  border-radius: 24px;
  display: grid;
  justify-items: center;
  align-content: start;
  background: var(--ui-surface-white);
}

.ref-account__amount {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-account__withdraw {
  width: 230px;
  margin-top: 16px;
  color: #79F397;
}

.ref-account__section-header {
  margin-top: 40px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.ref-account__section-title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-account__history {
  padding: 0;
  border: 0;
  background: transparent;
  color: #1B74FF;
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  cursor: pointer;
}

.ref-account__tabs {
  margin-top: 22px;
}

.ref-account__ops {
  margin-top: 22px;
  display: grid;
  gap: 10px;
}

.ref-account__empty {
  margin-top: 40px;
  display: grid;
  justify-items: center;
  text-align: center;
}

.ref-account__empty-image {
  width: 144px;
  height: 124px;
  display: block;
  object-fit: contain;
}

.ref-account__empty-text {
  width: 187px;
  margin: 20px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}
</style>
