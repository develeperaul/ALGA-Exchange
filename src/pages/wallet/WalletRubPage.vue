<template>
  <q-page class="wallet-rub-page">
    <main class="wallet-rub" :aria-label="pageTitle">
      <header class="wallet-rub__header">
        <button class="wallet-rub__back" type="button" aria-label="Назад" @click="goBack">
          <span aria-hidden="true" />
        </button>
        <h1 class="wallet-rub__title">{{ pageTitle }}</h1>
      </header>

      <section class="wallet-rub__list" aria-label="Способы пополнения RUB">
        <button class="wallet-rub-method" type="button" @click="goToSbp">
          <span class="rub-bank-icon rub-bank-icon--sbp">
            <img :src="rubMethodIcons.sbp" alt="">
          </span>
          <span class="wallet-rub-method__label">СБП (по номеру телефона)</span>
          <span class="wallet-rub-method__chevron" aria-hidden="true" />
        </button>

        <button
          v-for="bank in directBanks"
          :key="bank.id"
          class="wallet-rub-method"
          type="button"
          @click="goToBank(bank.id)"
        >
          <RubBankIcon :bank="bank" />
          <span class="wallet-rub-method__label">{{ bank.label }}</span>
          <span class="wallet-rub-method__chevron" aria-hidden="true" />
        </button>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RubBankIcon from 'components/wallet/RubBankIcon.vue';
import { directRubBanks, rubMethodIcons, type RubBankId } from './rubDepositData';
import { usePaymentsStore } from '@/stores/payments-store';

defineOptions({
  name: 'WalletRubPage',
});

const route = useRoute();
const router = useRouter();
const paymentsStore = usePaymentsStore();
const directBanks = computed(() => directRubBanks);
const mode = computed<'deposit' | 'withdraw'>(() => (
  route.query.mode === 'withdraw' ? 'withdraw' : 'deposit'
));
const pageTitle = computed(() => (
  mode.value === 'deposit' ? 'Пополнить через RUB' : 'Вывести через RUB'
));

function goBack() {
  void router.push('/wallet');
}

function goToSbp() {
  paymentsStore.setFlowMode(mode.value);
  void router.push({
    path: '/wallet/deposit/rub/sbp',
    query: { mode: mode.value },
  });
}

function goToBank(bankId: RubBankId) {
  paymentsStore.setFlowMode(mode.value);
  void router.push({
    path: `/wallet/deposit/rub/bank/${bankId}`,
    query: { mode: mode.value },
  });
}
</script>

<style scoped lang="scss">
.wallet-rub-page {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.wallet-rub {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(74px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(32px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.wallet-rub__header {
  height: 26px;
  position: relative;
  display: grid;
  place-items: center;
}

.wallet-rub__back {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  position: absolute;
  left: 0;
  top: 1px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.wallet-rub__back span {
  width: 10px;
  height: 10px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(2px) rotate(45deg);
}

.wallet-rub__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.wallet-rub__list {
  margin-top: 30px;
  display: grid;
  gap: 11px;
}

.wallet-rub-method {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 10px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  cursor: pointer;
}

.wallet-rub-method__label {
  min-width: 0;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--ui-font-t1);
  line-height: normal;
  font-weight: 400;
  letter-spacing: -0.3px;
}

.wallet-rub-method__chevron {
  width: 10px;
  height: 10px;
  border-top: 1.5px solid var(--ui-text-muted);
  border-right: 1.5px solid var(--ui-text-muted);
  transform: rotate(45deg);
}

.rub-bank-icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #D4F5DC;
}

.rub-bank-icon img {
  width: 18px;
  height: 22px;
  display: block;
  object-fit: contain;
}
</style>
