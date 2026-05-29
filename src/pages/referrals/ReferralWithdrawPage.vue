<template>
  <q-page class="ref-withdraw-page">
    <main v-if="!isSuccess" class="ref-withdraw" aria-label="Реферальный вывод">
      <header class="ref-withdraw__hero">
        <div class="ref-withdraw__top">
          <button class="ref-withdraw__back" type="button" aria-label="Назад" @click="goBack">
            <span aria-hidden="true" />
          </button>

          <h1 class="ref-withdraw__title">
            Реферальный вывод
          </h1>
        </div>

        <section class="ref-withdraw__balance" aria-label="Баланс">
          <p class="ref-withdraw__balance-value">
            {{ balance }} USDT
          </p>
          <p class="ref-withdraw__balance-label">
            Баланс
          </p>
        </section>
      </header>

      <form class="ref-withdraw__form" @submit.prevent="submit">
        <label class="ref-withdraw__field">
          <span class="ref-withdraw__label">Адрес кошелька</span>
          <span class="ref-withdraw__control">
            <input v-model="walletAddress" class="ref-withdraw__input" type="text" autocomplete="off">
          </span>
        </label>

        <p class="ref-withdraw__hint">
          Сеть USDT TRC 20
        </p>

        <label class="ref-withdraw__field ref-withdraw__field--amount">
          <span class="ref-withdraw__label">Сумма вывода</span>
          <span class="ref-withdraw__control">
            <input
              :value="amount"
              class="ref-withdraw__input"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              @input="onAmountInput"
            >
            <span class="ref-withdraw__suffix">USDT</span>
          </span>
        </label>

        <p class="ref-withdraw__hint">
          Min сумма {{ minAmount }} USDT
        </p>

        <div class="ref-withdraw__fee" aria-label="Комиссия">
          <span>{{ fee }} USDT</span>
          <span>Комиссия сети TRON</span>
        </div>

        <label v-if="showReceiveAmount" class="ref-withdraw__field ref-withdraw__field--receive">
          <span class="ref-withdraw__label ref-withdraw__label--strong">Сумма к получению</span>
          <span class="ref-withdraw__control">
            <input class="ref-withdraw__input ref-withdraw__input--strong" type="text" :value="receiveAmount" readonly>
            <span class="ref-withdraw__suffix">USDT</span>
          </span>
        </label>

        <UiButton class="ref-withdraw__submit" size="large" type="submit" :disabled="!canSubmit">
          Вывести
        </UiButton>
      </form>
    </main>

    <main v-else class="ref-withdraw-success" aria-label="Успешный вывод">
      <section class="ref-withdraw-success__card">
        <div class="ref-withdraw-success__icon" aria-hidden="true">
          <q-icon name="receipt_long" size="28px" />
        </div>

        <p class="ref-withdraw-success__amount">
          -{{ submittedAmount }} USDT
        </p>
        <p class="ref-withdraw-success__title">
          Вывод реферальных средств
        </p>
        <p class="ref-withdraw-success__text">
          Средства поступят в течение 3-х рабочих дней
        </p>
      </section>

      <UiButton class="ref-withdraw-success__button" size="large" @click="goHome">
        На главную
      </UiButton>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';

defineOptions({
  name: 'ReferralWithdrawPage',
});

const router = useRouter();

const balance = 560;
const fee = 3;
const minAmount = 500;
const walletAddress = ref('siejdkaav1521sswol741gpsf51epaklvdja');
const amount = ref('');
const submittedAmount = ref('');
const isSuccess = ref(false);

const numericAmount = computed(() => Number(amount.value.replace(',', '.')) || 0);
const showReceiveAmount = computed(() => numericAmount.value > 0);
const receiveAmount = computed(() => Math.max(numericAmount.value - fee, 0));
const canSubmit = computed(() => (
  numericAmount.value >= minAmount &&
  numericAmount.value <= balance &&
  walletAddress.value.trim().length > 0
));

function onAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const normalized = input.value.replace(',', '.').replace(/[^\d.]/g, '');
  const [integer = '', fraction = ''] = normalized.split('.');
  const nextValue = fraction ? `${integer}.${fraction.slice(0, 2)}` : integer;
  const nextNumber = Number(nextValue);

  amount.value = nextNumber > balance ? String(balance) : nextValue;
}

function submit() {
  if (!canSubmit.value) return;

  submittedAmount.value = amount.value;
  isSuccess.value = true;
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/referrals/account');
}

function goHome() {
  void router.push('/');
}
</script>

<style scoped lang="scss">
.ref-withdraw-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.ref-withdraw,
.ref-withdraw-success {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.ref-withdraw {
  padding:
    calc(244px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(36px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
}

.ref-withdraw__hero {
  margin:
    calc(-244px - var(--ui-safe-area-top))
    calc(-16px - var(--ui-safe-area-right))
    0
    calc(-16px - var(--ui-safe-area-left));
  padding:
    calc(60px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    30px
    calc(16px + var(--ui-safe-area-left));
  border-bottom-right-radius: 40px;
  border-bottom-left-radius: 40px;
  background: var(--ui-surface-white);
}

.ref-withdraw__top {
  height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ref-withdraw__back {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.ref-withdraw__back span {
  width: 10px;
  height: 10px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(1px) rotate(135deg);
}

.ref-withdraw__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-withdraw__balance {
  height: 100px;
  margin-top: 20px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  align-content: center;
  background: #E8EBED;
}

.ref-withdraw__balance-value {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: 24px;
  line-height: 31.2px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-withdraw__balance-label {
  margin: 4px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-withdraw__form {
  margin-top: 28px;
}

.ref-withdraw__field {
  display: block;
}

.ref-withdraw__field--amount {
  margin-top: 24px;
}

.ref-withdraw__field--receive {
  margin-top: 24px;
}

.ref-withdraw__label {
  display: block;
  margin-bottom: 12px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.ref-withdraw__label--strong {
  font-weight: 500;
}

.ref-withdraw__control {
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.ref-withdraw__input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-withdraw__field--amount .ref-withdraw__input,
.ref-withdraw__field--receive .ref-withdraw__input {
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.ref-withdraw__input--strong {
  font-weight: 500;
}

.ref-withdraw__suffix {
  flex: 0 0 auto;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
}

.ref-withdraw__hint {
  margin: 10px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-withdraw__fee {
  height: 50px;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #F0F0F0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-withdraw__fee span:last-child {
  color: var(--ui-text-muted);
}

.ref-withdraw__submit {
  margin-top: 30px;
}

.ref-withdraw-success {
  padding:
    calc(104px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(36px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
}

.ref-withdraw-success__card {
  min-height: 200px;
  padding: 54px 20px 28px;
  border-radius: 24px;
  position: relative;
  display: grid;
  justify-items: center;
  text-align: center;
  background: var(--ui-surface-white);
}

.ref-withdraw-success__icon {
  width: 60px;
  height: 60px;
  border: 8px solid var(--ui-surface-page);
  border-radius: 50%;
  position: absolute;
  top: -30px;
  left: 50%;
  display: grid;
  place-items: center;
  background: var(--ui-brand-light);
  color: var(--ui-text-brand);
  transform: translateX(-50%);
}

.ref-withdraw-success__amount {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: 24px;
  line-height: 31.2px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.ref-withdraw-success__title {
  margin: 5px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.ref-withdraw-success__text {
  width: 207px;
  margin: 20px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.ref-withdraw-success__button {
  width: 250px;
  margin: 59px auto 0;
  display: flex;
}
</style>
