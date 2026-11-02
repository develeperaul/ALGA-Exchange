<template>
  <q-page class="invoice-page">
    <SuccessOverlay v-model="showSuccess" />

    <main class="invoice-screen" aria-label="Оплата инвойса">
      <PageHeader title="Оплата инвойса" />

      <section class="invoice-form">
        <UiInput
          v-model="form.country"
          name="invoice-country"
          label="Страна"
          placeholder="Введите страну"
        />
        <UiInput v-if="!isMockMode" v-model="form.telegram" name="invoice-telegram" label="Telegram-никнейм" placeholder="@username" />
        <p v-if="!isMockMode && options" class="invoice-field__text">Минимальная сумма: {{ options.invoice_min }} USDT</p>
        <div class="invoice-field">
          <span class="invoice-field__label">Сумма инвойса</span>
          <div class="invoice-field__amount">
            <input
              v-model="form.amount"
              class="invoice-field__amount-input"
              type="text"
              inputmode="numeric"
              placeholder="Введите сумму"
            >
            <span class="invoice-field__amount-currency">USDT</span>
          </div>
        </div>
        <div class="invoice-field">
          <span class="invoice-field__label">Описание</span>
          <textarea
            v-model="form.description"
            class="invoice-field__textarea"
            placeholder=""
            rows="4"
          />
          <span class=" invoice-field__text">
            Опишите максимально подробно назначение платежа (за что оплата, детали платежа)
          </span>
        </div>

        <p v-if="!isMockMode && optionsError" role="alert">{{ optionsError }}</p>
        <p v-if="!isMockMode && submitError" role="alert">{{ submitError }}</p>
        <p v-if="!isMockMode && uncertain" role="alert">Результат отправки неизвестен. Не отправляйте заявку повторно; уточните её у менеджера.</p>
        <p v-if="!isMockMode && submissionMessage" role="status">{{ submissionMessage }}</p>
        <UiButton
          class="invoice-form__submit"
          size="large"
          :disabled="!isMockMode && (submitting || uncertain || !options || !!submissionMessage)"
          @click="onSubmit"
        >
          {{ submitting ? 'Отправка…' : 'Отправить' }}
        </UiButton>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import UiButton from 'components/ui/UiButton.vue';
import UiInput from 'components/ui/UiInput.vue';
import PageHeader from 'components/PageHeader.vue';
import SuccessOverlay from 'components/SuccessOverlay.vue';
import { isMockMode } from '@/api/config';
import { createInvoicePayout, fetchPayoutOptions, isAmbiguousPayoutFailure, validAmount, type PayoutOptions } from '@/api/operations';
import { useAuthStore } from '@/stores/auth-store';
import { getSessionScope, isCurrentSession, onSessionChange } from '@/api/session';

defineOptions({
  name: 'InvoicePage',
});

const showSuccess = ref(false);
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

const form = reactive({
  country: '',
  description: '',
  amount: '',
  telegram: '',
});
function clearSensitiveState() {
  form.country = ''; form.description = ''; form.amount = ''; form.telegram = '';
  options.value = null; optionsError.value = ''; submitError.value = '';
  submissionMessage.value = ''; submitting.value = false; uncertain.value = false;
}
const unsubscribe = onSessionChange(() => { if (!isMockMode) clearSensitiveState(); });
onUnmounted(() => { disposed = true; unsubscribe(); if (!isMockMode) clearSensitiveState(); });

async function onSubmit() {
  if (isMockMode) { showSuccess.value = true; return; }
  if (disposed || submitting.value || uncertain.value || submissionMessage.value) return;
  submitError.value = '';
  if (!auth.isAuthenticated || !options.value) {
    submitError.value = 'Для заявки нужны авторизация и доступные условия'; return;
  }
  if (!/[\p{L}]/u.test(form.country) || !/^@?[A-Za-z0-9_]{1,32}$/.test(form.telegram.trim()) ||
    !validAmount(form.amount.trim(), options.value.invoice_min, 2) || !form.description.trim() || form.description.length > 5000) {
    submitError.value = 'Заполните страну, Telegram, сумму и описание по условиям заявки'; return;
  }
  submitting.value = true;
  const epoch = getSessionScope().epoch;
  try {
    const id = await createInvoicePayout({ country: form.country.trim(), telegram_username: form.telegram.trim(),
      source_amount: form.amount.trim(), description: form.description.trim() });
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
.invoice-page {
  width: 100%;
  min-height: 100%;
  background: var(--ui-surface-page);
}

.invoice-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(16px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.invoice-form {
  margin-top: 24px;
  display: grid;
  gap: 16px;
}

.invoice-field {
  display: grid;
  gap: 12px;
}
.invoice-field__text {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
}

.invoice-field__label {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.invoice-field__textarea {
  width: 100%;
  min-height: 80px;
  padding: 16px 20px;
  border: 0;
  border-radius: 16px;
  resize: vertical;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.invoice-field__textarea::placeholder {
  color: var(--ui-text-muted);
}

.invoice-field__amount {
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
}

.invoice-field__amount-input {
  min-width: 0;
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.invoice-field__amount-input::placeholder {
  color: var(--ui-text-muted);
}

.invoice-field__amount-currency {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.invoice-form__submit {
  margin-top: 16px;
}
</style>
