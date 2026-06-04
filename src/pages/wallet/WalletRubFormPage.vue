<template>
  <q-page class="wallet-rub-form-page">
    <main class="wallet-rub-form" :aria-label="pageTitle">
      <header class="wallet-rub-form__header">
        <button class="wallet-rub-form__back" type="button" aria-label="Назад" @click="goBack">
          <UiIcon

                name="back"
                :size="24"
                color="var(--ui-text-icon)"
              />

        </button>

        <span v-if="isSbp" class="rub-bank-icon rub-bank-icon--sbp wallet-rub-form__title-icon" aria-hidden="true">
          <img :src="rubMethodIcons.sbp" alt="">
        </span>
        <RubBankIcon v-else :bank="currentBank" class="wallet-rub-form__title-icon" />

        <h1 class="wallet-rub-form__title">{{ pageTitle }}</h1>
      </header>

      <section class="wallet-rub-form__fields">
        <div class="wallet-rub-field">
          <p class="wallet-rub-field__label">{{ isSbp ? 'Номер телефона' : currentBank.label }}</p>
          <div class="wallet-rub-control wallet-rub-control--locked">
            <span>{{ rubDepositStatic.phone }}</span>

             <UiIcon
                class="wallet-rub-control__lock"
                name="lock"
                :size="16"
                color="var(--ui-text-icon)"
              />

          </div>
        </div>

        <div class="wallet-rub-field">
          <p class="wallet-rub-field__label">Сумма пополнения</p>
          <div class="wallet-rub-control wallet-rub-control--amount">
            <input
              v-model="amount"
              class="wallet-rub-control__input"
              type="number"
              inputmode="decimal"
              min="0"
              step="any"
              autocomplete="off"
              aria-label="Сумма пополнения"
            >
            <span class="wallet-rub-control__currency">{{ rubDepositStatic.amountCurrency }}</span>
          </div>
        </div>

        <div class="wallet-rub-rate">
          <div>
            <span>В рублях</span>
            <b>{{ rubDepositStatic.rubAmount }}</b>
          </div>
          <div>
            <span>Курс</span>
            <b>{{ rubDepositStatic.rate }}</b>
          </div>
        </div>

        <div v-if="isSbp" class="wallet-rub-field">
          <p class="wallet-rub-field__label">Банк</p>
          <button class="wallet-rub-control wallet-rub-control--select" type="button" @click="isBankSheetOpen = true">
            <span v-if="selectedBank" class="wallet-rub-control__bank">
              <RubBankIcon :bank="selectedBank" />
              <span>{{ selectedBank.label }}</span>
            </span>
            <span v-else class="wallet-rub-control__bank wallet-rub-control__bank--placeholder">
              <span class="rub-bank-icon rub-bank-icon--sbp" aria-hidden="true">
                <img :src="rubMethodIcons.sbp" alt="">
              </span>
              <span>Выберите банк</span>
            </span>
            <span class="wallet-rub-control__chevron" aria-hidden="true" />
          </button>
        </div>

        <UiPromoField
          :model-value="rubDepositStatic.promo"
          readonly
          show-check
        />
      </section>

      <button class="wallet-rub-form__submit" type="button" @click="submit">
        Пополнить
      </button>

      <section class="wallet-rub-form__notes" aria-label="Информация">
        <p>
           <UiIcon

            name="info"
            :size="16"
            color="#BAB9BD"
          />
          Для пополнения вы будете перенаправлены в приложение банка или интернет-банк
        </p>
        <p>

          <UiIcon

            name="time"
            :size="16"
            color="#BAB9BD"
          />
          Время на пополнение 15 мин.
        </p>
      </section>
    </main>

    <UiBottomSheet
      v-model="isBankSheetOpen"
      aria-label="Выберите банк"
      panel-class="wallet-rub-bank-sheet"
      content-class="wallet-rub-bank-sheet__content"
      :show-handle="false"
      :closable="false"
    >
      <button class="wallet-rub-bank-sheet__close" type="button" aria-label="Закрыть" @click="isBankSheetOpen = false">
        <span aria-hidden="true" />
      </button>
      <h2 class="wallet-rub-bank-sheet__title">Банк</h2>
      <label class="wallet-rub-bank-search">
        <input
          v-model="bankSearch"
          type="search"
          autocomplete="off"
          placeholder="Введите название банка"
          aria-label="Введите название банка"
        >
        <span aria-hidden="true" />
      </label>
      <button
        v-for="bank in filteredSbpBanks"
        :key="bank.id"
        class="wallet-rub-bank-option"
        type="button"
        @click="selectBank(bank.id)"
      >
        <RubBankIcon :bank="bank" />
        <span>{{ bank.label }}</span>
        <span v-if="selectedBank?.id === bank.id" class="wallet-rub-bank-option__check" aria-hidden="true" />
      </button>
    </UiBottomSheet>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import UiPromoField from 'components/ui/UiPromoField.vue';
import RubBankIcon from 'components/wallet/RubBankIcon.vue';
import {
  findRubBank,
  rubDepositStatic,
  rubMethodIcons,
  sbpDefaultBankId,
  sbpBanks,
  type RubBankId,
} from './rubDepositData';

defineOptions({
  name: 'WalletRubFormPage',
});

const route = useRoute();
const router = useRouter();
const isBankSheetOpen = ref(false);
const selectedBankId = ref<RubBankId | null>(null);
const amount = ref(rubDepositStatic.amount);
const bankSearch = ref('');

const isSbp = computed(() => route.path.endsWith('/sbp'));
const routeBank = computed(() => findRubBank(route.params.bankId));
const fallbackBank = computed(() => findRubBank('sber')!);
const currentBank = computed(() => routeBank.value ?? fallbackBank.value);
const selectedBank = computed(() => selectedBankId.value ? findRubBank(selectedBankId.value) : undefined);
const pageTitle = computed(() => `Пополнить через ${isSbp.value ? 'СБП' : currentBank.value.label}`);
const filteredSbpBanks = computed(() => {
  const search = bankSearch.value.trim().toLowerCase();

  if (!search) {
    return sbpBanks;
  }

  return sbpBanks.filter((bank) => bank.label.toLowerCase().includes(search));
});

function goBack() {
  void router.push('/wallet/deposit/rub');
}

function selectBank(bankId: RubBankId) {
  selectedBankId.value = bankId;
  isBankSheetOpen.value = false;
}

function submit() {
  const bankId = isSbp.value
    ? selectedBankId.value ?? sbpDefaultBankId
    : currentBank.value.id;

  void router.push({
    path: '/wallet/deposit/rub/result',
    query: {
      method: isSbp.value ? 'sbp' : 'bank',
      bank: bankId,
      amount: amount.value.trim() || rubDepositStatic.amount,
      status: 'processing',
    },
  });
}
</script>

<style scoped lang="scss">
.wallet-rub-form-page {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.wallet-rub-form {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(74px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(28px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.wallet-rub-form__header {
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.wallet-rub-form__back {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  position: absolute;
  left: 0;
  top: 3px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}



.wallet-rub-form__title-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
}

.wallet-rub-form__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.wallet-rub-form__fields {
  margin-top: 28px;
  display: grid;
  gap: 24px;
}

.wallet-rub-field {
  display: grid;
  gap: 12px;
}

.wallet-rub-field__label {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.wallet-rub-control {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
  color: var(--ui-text-secondary);
  text-align: left;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.wallet-rub-control--amount {
  color: var(--ui-text-primary);
}

.wallet-rub-control__input {
  min-width: 0;
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font: inherit;
  letter-spacing: inherit;
}

.wallet-rub-control--select {
  cursor: pointer;
}

.wallet-rub-control__currency,
.wallet-rub-control__chevron {
  justify-self: end;
  color: var(--ui-text-muted);
}

.wallet-rub-control__chevron {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
}

.wallet-rub-control__lock {
  justify-self: end;
  position: relative;

}


.wallet-rub-control__bank {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ui-text-primary);
}

.wallet-rub-control__bank--placeholder {
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  letter-spacing: 0;
}

.wallet-rub-rate {
  height: 78px;
  padding: 15px 20px;
  border-radius: 16px;
  display: grid;
  gap: 8px;
  background: #E8EBED;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.wallet-rub-rate div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wallet-rub-rate b {
  color: var(--ui-text-primary);
  font-weight: 400;
}

.wallet-rub-form__submit {
  width: 100%;
  height: 50px;
  margin-top: 30px;
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

.wallet-rub-form__notes {
  margin-top: 27px;
  display: grid;
  gap: 13px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.wallet-rub-form__notes p {
  margin: 0;
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 8px;
}

.wallet-rub-note-icon {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #BDBEC4;
  color: var(--ui-text-inverse);
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
}

.wallet-rub-note-icon--clock {
  position: relative;
}

.wallet-rub-note-icon--clock::before,
.wallet-rub-note-icon--clock::after {
  content: "";
  width: 1.5px;
  border-radius: 2px;
  position: absolute;
  left: 7px;
  top: 4px;
  background: var(--ui-text-inverse);
}

.wallet-rub-note-icon--clock::before {
  height: 5px;
}

.wallet-rub-note-icon--clock::after {
  height: 4px;
  transform: rotate(-45deg);
  transform-origin: bottom;
}

.rub-bank-icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.rub-bank-icon--sbp {
  background: #D4F5DC;
}

.rub-bank-icon--sbp img {
  width: 18px;
  height: 22px;
}

:global(.wallet-rub-bank-sheet) {
  height: min(768px, 95vh);
  padding: 22px 16px calc(16px + var(--ui-safe-area-bottom));
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background: var(--ui-surface-page);
  box-shadow: none;
}

:global(.wallet-rub-bank-sheet__content) {
  padding: 0;
  position: relative;
  overflow-y: auto;
}

.wallet-rub-bank-sheet__close {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  position: absolute;
  top: 0;
  right: 16px;
  background: transparent;
  color: #C9C9C9;
  cursor: pointer;
}

.wallet-rub-bank-sheet__close span::before,
.wallet-rub-bank-sheet__close span::after {
  content: "";
  width: 18px;
  height: 2px;
  border-radius: 2px;
  position: absolute;
  top: 11px;
  left: 3px;
  background: currentColor;
}

.wallet-rub-bank-sheet__close span::before {
  transform: rotate(45deg);
}

.wallet-rub-bank-sheet__close span::after {
  transform: rotate(-45deg);
}

.wallet-rub-bank-sheet__title {
  margin: 26px 0 16px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.wallet-rub-bank-search {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  padding: 0 20px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
}

.wallet-rub-bank-search input {
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
}

.wallet-rub-bank-search input::placeholder {
  color: var(--ui-text-muted);
  opacity: 1;
}

.wallet-rub-bank-search span {
  width: 16px;
  height: 16px;
  justify-self: end;
  border: 1.5px solid var(--ui-text-muted);
  border-radius: 999px;
  position: relative;
}

.wallet-rub-bank-search span::after {
  content: "";
  width: 7px;
  height: 1.5px;
  border-radius: 2px;
  position: absolute;
  right: -5px;
  bottom: -2px;
  background: var(--ui-text-muted);
  transform: rotate(45deg);
}

.wallet-rub-bank-option {
  width: 100%;
  height: 30px;
  padding: 0;
  border: 0;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: var(--ui-text-primary);
  text-align: left;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  cursor: pointer;
}

.wallet-rub-bank-option + .wallet-rub-bank-option {
  margin-top: 14px;
}

.wallet-rub-bank-option :deep(.rub-bank-icon) {
  width: 30px;
  height: 30px;
}

.wallet-rub-bank-option__check {
  width: 16px;
  height: 9px;
  justify-self: end;
  border-left: 2px solid var(--ui-brand-primary);
  border-bottom: 2px solid var(--ui-brand-primary);
  transform: translateY(-2px) rotate(-45deg);
}
</style>
