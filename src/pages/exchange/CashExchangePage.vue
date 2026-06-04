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

        <UiInput
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
          hint="от 10 000 USDT"
          inputmode="numeric"
        />

        <UiPromoField
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
              {{ sellForm.date || 'Выбрать дату' }}
            </span>
          </button>
        </div>

        <UiSelect
          v-model="sellForm.time"
          label="Время"
          :options="timeOptions"
          placeholder="Выберите время"
        />

        <div class="cash-exchange__info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>При совершении сделки может потребоваться заключение ДКП (договора купли-продажи)</span>
        </div>

        <UiButton size="large" class="cash-exchange__submit" @click="onSubmit">
          Далее
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

        <UiInput
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
          hint="от 10 000 USDT"
          inputmode="numeric"
        />

        <UiPromoField
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
              {{ buyForm.date || 'Выбрать дату' }}
            </span>
          </button>
        </div>

        <UiSelect
          v-model="buyForm.time"
          label="Время"
          :options="timeOptions"
          placeholder="Выберите время"
        />

        <div class="cash-exchange__info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>При совершении сделки может потребоваться заключение ДКП (договора купли-продажи)</span>
        </div>

        <UiButton size="large" class="cash-exchange__submit" @click="onSubmit">
          Далее
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
import { ref, reactive, watch } from 'vue';
import UiButton from 'components/ui/UiButton.vue';
import UiCalendar from 'components/ui/UiCalendar.vue';
import UiInput from 'components/ui/UiInput.vue';
import UiPromoField from 'components/ui/UiPromoField.vue';
import UiSelect from 'components/ui/UiSelect.vue';
import UiTabs, { type UiTabOption } from 'components/ui/UiTabs.vue';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

defineOptions({
  name: 'CashExchangePage',
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
});

const calendarOpen = ref(false);
const calendarValue = ref('');
const calendarTarget = ref<'sell' | 'buy'>('sell');

function openCalendar(target: 'sell' | 'buy') {
  calendarTarget.value = target;
  const currentDate = target === 'sell' ? sellForm.date : buyForm.date;
  calendarValue.value = currentDate || '';
  calendarOpen.value = true;
}

watch(calendarValue, (val) => {
  if (!calendarOpen.value) return;
  const formatted = val ? dayjs(val).format('DD MM YYYY') : '';
  if (calendarTarget.value === 'sell') {
    sellForm.date = formatted;
  } else {
    buyForm.date = formatted;
  }
});

function onSubmit() {
  const form = activeTab.value === 'sell' ? sellForm : buyForm;
  console.log('Submit', activeTab.value, form);
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
