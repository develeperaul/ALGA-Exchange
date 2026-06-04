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

        <UiButton
          class="invoice-form__submit"
          size="large"
          @click="onSubmit"
        >
          Отправить
        </UiButton>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import UiButton from 'components/ui/UiButton.vue';
import UiInput from 'components/ui/UiInput.vue';
import PageHeader from 'components/PageHeader.vue';
import SuccessOverlay from 'components/SuccessOverlay.vue';

defineOptions({
  name: 'InvoicePage',
});

const showSuccess = ref(false);

const form = reactive({
  country: '',
  description: '',
  amount: '',
});

function onSubmit() {
  console.log('Invoice submitted', form);
  showSuccess.value = true;
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
