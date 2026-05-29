<template>
  <q-page class="wallet-page">
    <main class="wallet-screen" aria-label="Кошелек">
      <h1 class="wallet-title">
        Безналичный обмен
      </h1>

      <section class="wallet-balance" aria-label="Баланс">
        <p class="wallet-balance__value">{{ balanceText }}</p>
        <p class="wallet-balance__label">Баланс</p>
      </section>

      <section class="wallet-actions" aria-label="Действия">
        <button
          class="wallet-action"
          :class="{ 'wallet-action--raised': isHistory }"
          type="button"
          aria-label="Вывести"
        >
          <span
            class="wallet-action__icon"
            :class="isHistory ? 'wallet-action__icon--brand' : 'wallet-action__icon--muted'"
            aria-hidden="true"
          >
            <svg
              class="wallet-action__arrow-icon wallet-action__arrow-icon--up"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 3.2v9.6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M5.6 10.2 9 13.6 12.4 10.2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="wallet-action__text" :class="{ 'wallet-action__text--muted': !isHistory }">Вывести</span>
        </button>

        <button
          class="wallet-action wallet-action--raised"
          type="button"
          aria-label="Пополнить"
          @click="isDepositSheetOpen = true"
        >
          <span class="wallet-action__icon wallet-action__icon--brand" aria-hidden="true">
            <svg
              class="wallet-action__arrow-icon"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 3.2v9.6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M5.6 10.2 9 13.6 12.4 10.2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="wallet-action__text">Пополнить</span>
        </button>
      </section>

      <header class="wallet-section-header">
        <h2 class="wallet-section-title">
          Последние операции
        </h2>
        <button v-if="isHistory" class="wallet-history" type="button" @click="goToHistory">
          История
        </button>
      </header>

      <section v-if="isHistory" class="wallet-ops" aria-label="Последние операции">
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

      <section v-else class="wallet-empty" aria-live="polite">
        <img class="wallet-empty__image" :src="walletImage" alt="" aria-hidden="true">
        <p class="wallet-empty__text">Пока тут пусто</p>
      </section>
    </main>

    <UiBottomSheet
      v-model="isDepositSheetOpen"
      aria-label="Пополнить через"
      panel-class="wallet-deposit-sheet"
      content-class="wallet-deposit-sheet__content"
      :show-handle="false"
      :closable="false"
    >
      <button class="wallet-deposit-sheet__close" type="button" aria-label="Закрыть" @click="isDepositSheetOpen = false">
        <span aria-hidden="true" />
      </button>

      <h2 class="wallet-deposit-sheet__title">
        Пополнить через
      </h2>

      <button
        v-for="method in depositMethods"
        :key="method.code"
        class="wallet-deposit-method"
        type="button"
        @click="selectDepositMethod(method.code)"
      >
        <span class="wallet-deposit-method__icon" :class="`wallet-deposit-method__icon--${method.code.toLowerCase()}`">
          {{ method.icon }}
        </span>
        <span class="wallet-deposit-method__label">{{ method.label }}</span>
        <span class="wallet-deposit-method__chevron" aria-hidden="true" />
      </button>
    </UiBottomSheet>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import walletImage from 'assets/wallet.png';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import WalletOperationRow, { type WalletOpDirection, type WalletOpTone } from 'components/wallet/WalletOperationRow.vue';

defineOptions({
  name: 'WalletPage',
});

type WalletVariant = 'empty' | 'history';
// Demo toggle пока без API.
// Переключай на 'history', чтобы увидеть вариант с операциями.
const variant: WalletVariant = 'empty';
const isHistory = variant === 'history';

const router = useRouter();
const isDepositSheetOpen = ref(false);

const balanceText = isHistory ? '100 USDT' : '0 USDT';
const depositMethods = [
  { code: 'USDT', label: 'USDT', icon: 'T' },
  { code: 'RUB', label: 'RUB', icon: '₽' },
] as const;

const operations: Array<{
  id: number;
  direction: WalletOpDirection;
  title: string;
  subtitle: string;
  amount: string;
  tone: WalletOpTone;
  date: string;
}> = [
  {
    id: 1,
    direction: 'out',
    title: 'Вывод средств',
    subtitle: 'Т-банк',
    amount: '-132 USDT',
    tone: 'default',
    date: '8 фев. 2026 г.',
  },
  {
    id: 2,
    direction: 'in',
    title: 'Пополнение',
    subtitle: 'СПБ',
    amount: '+11 USDT',
    tone: 'positive',
    date: '19 янв. 2026 г.',
  },
];

function goToHistory() {
  void router.push('/orders/history');
}

function selectDepositMethod(code: (typeof depositMethods)[number]['code']) {
  isDepositSheetOpen.value = false;

  if (code === 'USDT') {
    void router.push('/wallet/deposit');
  } else {
    void router.push('/wallet/deposit/rub');
  }
}
</script>

<style scoped lang="scss">
.wallet-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.wallet-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(30px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.wallet-title {
  margin: 0;
  text-align: center;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.wallet-balance {
  height: 115px;
  margin-top: 26px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  background: var(--ui-surface-white);
}

.wallet-balance__value {
  margin: 0;
  padding-top: 2px;
  color: var(--ui-text-primary);
  font-size: 24px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: 0;
}

.wallet-balance__label {
  margin: -8px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.wallet-actions {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.wallet-action {
  height: 90px;
  padding: 0;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-rows: 58px 1fr;
  place-items: center;
  background: var(--ui-surface-white);
  box-shadow: none;
  cursor: pointer;
}

.wallet-action--raised {
  box-shadow: 0 2px 9px 0 rgb(0 0 0 / 5%);
}

.wallet-action:active {
  transform: translateY(1px);
}

.wallet-action:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.wallet-action__icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
}

.wallet-action__icon--muted {
  background: var(--ui-brand-soft);
  color: var(--ui-text-brand);
}

.wallet-action__icon--brand {
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
}

.wallet-action__arrow-icon {
  display: block;
}

.wallet-action__arrow-icon--up {
  transform: rotate(180deg);
}

.wallet-action__text {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.wallet-action__text--muted {
  color: var(--ui-text-muted);
}

.wallet-section-title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.wallet-section-header {
  margin-top: 28px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.wallet-history {
  padding: 0;
  border: 0;
  background: transparent;
  color: #1B74FF;
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  cursor: pointer;
}

.wallet-history:active {
  transform: translateY(1px);
}

.wallet-history:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
  border-radius: 6px;
}

.wallet-ops {
  margin-top: 18px;
  display: grid;
  gap: 18px;
}

.wallet-empty {
  margin-top: 60px;
  display: grid;
  justify-items: center;
  text-align: center;
}

.wallet-empty__image {
  width: 144px;
  height: 124px;
  display: block;
  object-fit: contain;
}

.wallet-empty__text {
  margin: 20px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: 0;
}

:global(.wallet-deposit-sheet) {
  min-height: 213px;
  padding: 16px 16px 30px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: none;
}

:global(.wallet-deposit-sheet__content) {
  padding: 0;
  position: relative;
  overflow: visible;
}

.wallet-deposit-sheet__close {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  position: absolute;
  top: 0;
  right: 4px;
  background: transparent;
  color: #C9C9C9;
  cursor: pointer;
}

.wallet-deposit-sheet__close span::before,
.wallet-deposit-sheet__close span::after {
  content: "";
  width: 18px;
  height: 2px;
  border-radius: 2px;
  position: absolute;
  top: 11px;
  left: 3px;
  background: currentColor;
}

.wallet-deposit-sheet__close span::before {
  transform: rotate(45deg);
}

.wallet-deposit-sheet__close span::after {
  transform: rotate(-45deg);
}

.wallet-deposit-sheet__title {
  margin: 27px 0 16px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.wallet-deposit-method {
  width: 100%;
  height: 45px;
  padding: 0 18px 0 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 10px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  cursor: pointer;
}

.wallet-deposit-method + .wallet-deposit-method {
  margin-top: 10px;
}

.wallet-deposit-method__icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--ui-text-inverse);
  font-size: 14px;
  line-height: 1;
  font-weight: 600;
}

.wallet-deposit-method__icon--usdt {
  background: #50AF95;
}

.wallet-deposit-method__icon--rub {
  background: #5A67E8;
}

.wallet-deposit-method__label {
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--ui-font-t1);
  line-height: normal;
  font-weight: 400;
  letter-spacing: -0.3px;
}

.wallet-deposit-method__chevron {
  width: 10px;
  height: 10px;
  border-top: 1.5px solid var(--ui-text-muted);
  border-right: 1.5px solid var(--ui-text-muted);
  transform: rotate(45deg);
}
</style>
