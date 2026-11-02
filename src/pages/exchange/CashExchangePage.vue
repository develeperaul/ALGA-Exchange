<template>
  <q-page class="cash-exchange-page">
    <main class="cash-exchange">
      <header class="cash-exchange__header">
        <h1 class="cash-exchange__title">Наличный обмен</h1>
      </header>

      <UiTabs
        v-model="activeTab"
        :options="tabOptions"
        class="cash-exchange__tabs"
      />
      <p v-if="!isMockMode && optionsError" role="alert">{{ optionsError }}</p>
      <p v-if="!isMockMode && submissionMessage" role="status">{{ submissionMessage }}</p>
      <p v-if="!isMockMode && submitError" role="alert">{{ submitError }}</p>
      <p v-if="!isMockMode && uncertain" role="alert">Результат отправки неизвестен. Не отправляйте заявку повторно; уточните её у менеджера.</p>

      <!-- Таб: Продать USDT -->
      <section v-if="activeTab === 'sell'" class="cash-exchange__form">
        <UiInput
          v-model="sellForm.country"
          name="sell-country"
          label="Страна"
          placeholder="Введите страну"
        />

        <UiInput
          v-model="sellForm.city"
          name="sell-city"
          label="Город"
          placeholder="Введите город"
        />

        <UiInput v-if="isMockMode"
          v-model="sellForm.currency"
          name="sell-currency"
          label="Валюта получения"
          placeholder="Введите валюту"
        />

        <UiInput
          v-model="sellForm.amount"
          name="sell-amount"
          label="Сумма продажи"
          placeholder="Введите сумму"
          :hint="`от ${options?.cash_sell_min ?? '—'} USDT`"
          inputmode="numeric"
        />
        <UiInput v-if="!isMockMode" v-model="sellForm.telegram" name="sell-telegram" label="Telegram-никнейм" placeholder="@username" />

        <UiPromoField v-if="isMockMode"
          v-model="sellForm.promoCode"
          readonly
          show-check
        />

        <div class="cash-exchange__field">
          <span class="cash-exchange__field-label">Дата</span>
          <button
            type="button"
            class="cash-exchange__date-trigger"
            @click="openCalendar('sell')"
          >
            <span :class="{ 'cash-exchange__date-placeholder': !sellForm.date }">
              {{ sellForm.date ? dayjs(sellForm.date).format('DD MM YYYY') : 'Выбрать дату' }}
            </span>
          </button>
        </div>

        <UiSelect
          v-model="sellForm.time"
          label="Время"
          :options="isMockMode ? timeOptions : (options?.time_slots ?? []).map(slot => ({ label: slot, value: slot }))"
          placeholder="Выберите время"
        />

        <div class="cash-exchange__info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>При совершении сделки может потребоваться заключение ДКП (договора купли-продажи)</span>
        </div>

        <UiButton size="large" class="cash-exchange__submit" :disabled="!isMockMode && (submitting || uncertain || !options || !!submissionMessage)" @click="onSubmit">
          {{ isMockMode ? 'Далее' : submitting ? 'Отправка…' : 'Отправить заявку' }}
        </UiButton>
      </section>

      <!-- Таб: Купить USDT -->
      <section v-if="activeTab === 'buy'" class="cash-exchange__form">
        <UiInput
          v-model="buyForm.country"
          name="buy-country"
          label="Страна"
          placeholder="Введите страну"
        />

        <UiInput
          v-model="buyForm.city"
          name="buy-city"
          label="Город"
          placeholder="Введите город"
        />

        <UiInput v-if="isMockMode"
          v-model="buyForm.currency"
          name="buy-currency"
          label="Валюта покупки"
          placeholder="Введите валюту"
        />

        <UiInput
          v-model="buyForm.amount"
          name="buy-amount"
          label="Сумма покупки"
          placeholder="Введите сумму"
          :hint="`от ${options?.cash_buy_min ?? '—'} USDT`"
          inputmode="numeric"
        />
        <UiInput v-if="!isMockMode" v-model="buyForm.telegram" name="buy-telegram" label="Telegram-никнейм" placeholder="@username" />

        <UiPromoField v-if="isMockMode"
          v-model="buyForm.promoCode"
          readonly
          show-check
        />

        <div class="cash-exchange__field">
          <span class="cash-exchange__field-label">Дата</span>
          <button
            type="button"
            class="cash-exchange__date-trigger"
            @click="openCalendar('buy')"
          >
            <span :class="{ 'cash-exchange__date-placeholder': !buyForm.date }">
              {{ buyForm.date ? dayjs(buyForm.date).format('DD MM YYYY') : 'Выбрать дату' }}
            </span>
          </button>
        </div>

        <UiSelect
          v-model="buyForm.time"
          label="Время"
          :options="isMockMode ? timeOptions : (options?.time_slots ?? []).map(slot => ({ label: slot, value: slot }))"
          placeholder="Выберите время"
        />

        <div class="cash-exchange__info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>При совершении сделки может потребоваться заключение ДКП (договора купли-продажи)</span>
        </div>

        <UiButton size="large" class="cash-exchange__submit" :disabled="!isMockMode && (submitting || uncertain || !options || !!submissionMessage)" @click="onSubmit">
          {{ isMockMode ? 'Далее' : submitting ? 'Отправка…' : 'Отправить заявку' }}
        </UiButton>
      </section>
    </main>

    <!-- Calendar Bottom Sheet -->
    <UiBottomSheet
      v-model="calendarOpen"
      aria-label="Выбор даты"
      :show-handle="false"
      :closable="false"
      panel-class="cash-exchange__calendar-panel"
    >
      <UiCalendar
        v-model="calendarValue"
        @close="calendarOpen = false"
      />
    </UiBottomSheet>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import UiCalendar from 'components/ui/UiCalendar.vue';
import UiInput from 'components/ui/UiInput.vue';
import UiPromoField from 'components/ui/UiPromoField.vue';
import UiSelect from 'components/ui/UiSelect.vue';
import UiTabs, { type UiTabOption } from 'components/ui/UiTabs.vue';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { isMockMode } from '@/api/config';
import { createCashPayout, fetchPayoutOptions, isAmbiguousPayoutFailure, validAmount, type PayoutOptions } from '@/api/operations';
import { useAuthStore } from '@/stores/auth-store';
import { getSessionScope, isCurrentSession, onSessionChange } from '@/api/session';

defineOptions({
  name: 'CashExchangePage',
});

const router = useRouter();
const auth = useAuthStore();
const options = ref<PayoutOptions | null>(null);
const optionsError = ref('');
const submitError = ref('');
const submissionMessage = ref('');
const submitting = ref(false);
const uncertain = ref(false);
let disposed = false;
const current = (epoch: number) => !disposed && isCurrentSession(epoch);
onMounted(async () => {
  if (isMockMode) return;
  const epoch = getSessionScope().epoch;
  try { const result = await fetchPayoutOptions(); if (current(epoch)) options.value = result; }
  catch (error) { if (current(epoch)) optionsError.value = error instanceof Error ? error.message : 'Не удалось загрузить условия'; }
});
const activeTab = ref('sell');

const tabOptions: UiTabOption[] = [
  { label: 'Продать USDT', value: 'sell' },
  { label: 'Купить USDT', value: 'buy' },
];

const timeOptions = [
  { label: '10:00-14:00', value: '10:00-14:00' },
  { label: '14:00-18:00', value: '14:00-18:00' },
  { label: '18:00-22:00', value: '18:00-22:00' },
];

const sellForm = reactive({
  country: '',
  city: '',
  currency: '',
  amount: '',
  promoCode: 't.me/DS_Exchange123456',
  hasPromo: false,
  date: '',
  time: '',
  telegram: '',
});

const buyForm = reactive({
  country: '',
  city: '',
  currency: '',
  amount: '',
  promoCode: 't.me/DS_Exchange123456',
  hasPromo: false,
  date: '',
  time: '',
  telegram: '',
});

const calendarOpen = ref(false);
const calendarValue = ref<Dayjs | ''>('');
const calendarTarget = ref<'sell' | 'buy'>('sell');
function clearSensitiveState() {
  for (const form of [sellForm, buyForm]) {
    form.country = ''; form.city = ''; form.currency = ''; form.amount = '';
    form.date = ''; form.time = ''; form.telegram = '';
  }
  calendarValue.value = ''; calendarOpen.value = false;
  options.value = null; optionsError.value = ''; submitError.value = '';
  submissionMessage.value = ''; submitting.value = false; uncertain.value = false;
}
const unsubscribe = onSessionChange(() => { if (!isMockMode) clearSensitiveState(); });
onUnmounted(() => { disposed = true; unsubscribe(); if (!isMockMode) clearSensitiveState(); });

function openCalendar(target: 'sell' | 'buy') {
  calendarTarget.value = target;
  const currentDate = target === 'sell' ? sellForm.date : buyForm.date;
  calendarValue.value = currentDate ? dayjs(currentDate) : '';
  calendarOpen.value = true;
}

watch(calendarValue, (val) => {
  if (!calendarOpen.value) return;
  const formatted = val ? dayjs(val).format('YYYY-MM-DD') : '';
  if (calendarTarget.value === 'sell') {
    sellForm.date = formatted;
  } else {
    buyForm.date = formatted;
  }
});

async function onSubmit() {
  const form = activeTab.value === 'sell' ? sellForm : buyForm;
  if (isMockMode) { void router.push('/exchange/cash/confirm'); return; }
  if (disposed || submitting.value || uncertain.value || submissionMessage.value) return;
  submitError.value = '';
  if (!auth.isAuthenticated || !options.value) {
    submitError.value = 'Для заявки нужны авторизация и доступные условия'; return;
  }
  const minimum = activeTab.value === 'sell' ? options.value.cash_sell_min : options.value.cash_buy_min;
  const date = dayjs(form.date);
  if (!/[\p{L}]/u.test(form.country) || !/[\p{L}]/u.test(form.city) ||
    !/^@?[A-Za-z0-9_]{1,32}$/.test(form.telegram.trim()) || !validAmount(form.amount.trim(), minimum, 2) ||
    !form.date || !date.isValid() || !options.value.time_slots.includes(form.time)) {
    submitError.value = 'Заполните страну, город, Telegram, сумму, дату и время по условиям заявки'; return;
  }
  submitting.value = true;
  const epoch = getSessionScope().epoch;
  try {
    const id = await createCashPayout({
      country: form.country.trim(), city: form.city.trim(), telegram_username: form.telegram.trim(),
      source_amount: form.amount.trim(), direction: activeTab.value as 'buy' | 'sell',
      appointment_date: date.format('YYYY-MM-DD'), time_slot: form.time,
    });
    if (current(epoch)) submissionMessage.value = `Заявка №${id} принята. Статус уточняйте у менеджера.`;
  } catch (error) {
    if (current(epoch)) {
      uncertain.value = isAmbiguousPayoutFailure(error);
      submitError.value = uncertain.value ? '' : error instanceof Error ? error.message : 'Не удалось отправить заявку';
    }
  } finally { if (current(epoch)) submitting.value = false; }
}
</script>

<style scoped lang="scss">
.cash-exchange-page {
  width: 100%;
  min-height: 100%;
  background: var(--ui-surface-page);
}

.cash-exchange {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(20px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.cash-exchange__header {
  margin-bottom: 24px;
}

.cash-exchange__title {
  margin: 0;
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.cash-exchange__tabs {
  margin-bottom: 24px;
}

.cash-exchange__form {
  display: grid;
  gap: 16px;
}

.cash-exchange__field {
  display: grid;
  gap: 12px;
}

.cash-exchange__field-label {
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
}

.cash-exchange__date-trigger {
  width: 100%;
  height: 50px;
  min-height: 50px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 16px;
  display: flex;
  align-items: center;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
  cursor: pointer;
  text-align: left;
}

.cash-exchange__date-placeholder {
  color: var(--ui-text-muted);
}

.cash-exchange__info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
}

.cash-exchange__info svg {
  flex: 0 0 auto;
  margin-top: 1px;
  color: var(--ui-text-muted);
}

.cash-exchange__submit {
  margin-top: 8px;
}

:global(.cash-exchange__calendar-panel) {
  padding: 16px;
  display: flex;
  justify-content: center;
  background: transparent;
  box-shadow: none;
}
</style>
