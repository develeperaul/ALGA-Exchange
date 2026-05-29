<template>
  <q-page class="wallet-rub-result-page">
    <main v-if="isExpired" class="wallet-rub-expired" aria-label="Истекло время ожидания">
      <section class="wallet-rub-expired__content">
        <div class="wallet-rub-expired__image-wrap" aria-hidden="true">
          <img class="wallet-rub-expired__image" :src="hourglassImage" alt="">
        </div>
        <h1 class="wallet-rub-expired__title">Истекло время ожидания</h1>
        <p class="wallet-rub-expired__text">Пополните счет заново</p>
        <button class="wallet-rub-expired__button" type="button" @click="goToWallet">
          К безналичным обменам
        </button>
      </section>
    </main>

    <main v-else class="wallet-rub-result" aria-label="Пополнение">
      <section class="wallet-rub-result__summary">
        <div class="wallet-rub-result__icons" aria-hidden="true">
          <RubBankIcon :bank="currentBank" class="wallet-rub-result__bank-icon" />
          <span class="wallet-rub-result__usdt-icon">T</span>
        </div>

        <div class="wallet-rub-result-card">
          <p class="wallet-rub-result-card__title">Пополнение</p>
          <p class="wallet-rub-result-card__amount">+{{ amount }} {{ rubDepositStatic.amountCurrency }}</p>
          <p class="wallet-rub-result-card__date">{{ rubDepositStatic.date }}</p>
        </div>
      </section>

      <section class="wallet-rub-result__details" aria-label="Детали операции">
        <div class="wallet-rub-result-detail">
          <p>Откуда</p>
          <b>{{ sourceTitle }}</b>
        </div>
        <div class="wallet-rub-result-detail">
          <p>ID заявки</p>
          <b>{{ rubDepositStatic.requestId }}</b>
        </div>
        <div class="wallet-rub-result-detail">
          <p>Статус</p>
          <b>В обработке</b>
        </div>
        <div class="wallet-rub-result-detail">
          <p>Курс</p>
          <b>{{ rubDepositStatic.resultRate }}</b>
        </div>
        <div class="wallet-rub-result-detail">
          <p>ID операции</p>
          <b>{{ rubDepositStatic.operationId }}</b>
        </div>
      </section>

      <button class="wallet-rub-result__close" type="button" @click="goToWallet">
        Закрыть
      </button>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RubBankIcon from 'components/wallet/RubBankIcon.vue';
import hourglassImage from 'assets/wallet/rub-hourglass.png';
import {
  findRubBank,
  rubDepositStatic,
  sbpDefaultBankId,
} from './rubDepositData';

defineOptions({
  name: 'WalletRubResultPage',
});

const route = useRoute();
const router = useRouter();

const isExpired = computed(() => route.query.status === 'expired');
const isSbp = computed(() => route.query.method === 'sbp');
const currentBank = computed(() => findRubBank(route.query.bank) ?? findRubBank(sbpDefaultBankId)!);
const sourceTitle = computed(() => isSbp.value ? `${currentBank.value.label} (по СБП)` : currentBank.value.label);
const amount = computed(() => {
  const value = Array.isArray(route.query.amount) ? route.query.amount[0] : route.query.amount;
  return value || rubDepositStatic.amount;
});

function goToWallet() {
  void router.push('/wallet');
}
</script>

<style scoped lang="scss">
.wallet-rub-result-page {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.wallet-rub-result,
.wallet-rub-expired {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.wallet-rub-result {
  padding:
    calc(68px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(32px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
}

.wallet-rub-result__summary {
  display: grid;
  justify-items: center;
  gap: 16px;
}

.wallet-rub-result__icons {
  width: 71px;
  height: 40px;
  position: relative;
}

.wallet-rub-result__bank-icon,
.wallet-rub-result__usdt-icon {
  width: 40px;
  height: 40px;
  border: 3px solid var(--ui-surface-white);
  position: absolute;
  top: 0;
}

.wallet-rub-result__bank-icon {
  left: 0;
}

.wallet-rub-result__usdt-icon {
  left: 31px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #50AF95;
  color: var(--ui-text-inverse);
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
}

.wallet-rub-result-card {
  width: 100%;
  height: 120px;
  border-radius: 24px;
  display: grid;
  justify-items: center;
  align-content: start;
  background: var(--ui-surface-white);
}

.wallet-rub-result-card__title {
  margin: 18px 0 0;
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.wallet-rub-result-card__amount {
  margin: 4px 0 0;
  color: var(--ui-text-brand);
  font-size: 24px;
  line-height: 31.2px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.wallet-rub-result-card__date {
  margin: 5px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
}

.wallet-rub-result__details {
  margin-top: 28px;
  display: grid;
  gap: 16px;
}

.wallet-rub-result-detail {
  display: grid;
  gap: 8px;
}

.wallet-rub-result-detail p,
.wallet-rub-result-detail b {
  margin: 0;
  font-weight: 400;
}

.wallet-rub-result-detail p {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.wallet-rub-result-detail b {
  overflow-wrap: anywhere;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.wallet-rub-result__close {
  width: 230px;
  height: 45px;
  margin: 31px auto 0;
  border: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: #737373;
  color: var(--ui-text-inverse);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: -0.3px;
  cursor: pointer;
}

.wallet-rub-expired {
  padding:
    calc(107px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(32px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
}

.wallet-rub-expired__content {
  display: grid;
  justify-items: center;
  text-align: center;
}

.wallet-rub-expired__image-wrap {
  width: 221px;
  height: 154px;
  display: grid;
  place-items: center;
}

.wallet-rub-expired__image {
  width: 182px;
  height: 182px;
  display: block;
  object-fit: contain;
}

.wallet-rub-expired__title {
  margin: 31px 0 0;
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.wallet-rub-expired__text {
  margin: 14px 0 0;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.wallet-rub-expired__button {
  width: 100%;
  height: 50px;
  margin-top: 26px;
  border: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
  font-size: var(--ui-font-button);
  line-height: var(--ui-line-button);
  font-weight: 600;
  letter-spacing: -0.3px;
  cursor: pointer;
}
</style>
