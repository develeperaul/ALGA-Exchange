<template>
  <q-page class="cash-exchange-confirm-page">
    <SuccessOverlay v-model="showSuccess" />
    <main class="cash-exchange-confirm" aria-label="Отправка заявки">
      <PageHeader title="Отправка заявки" />

      <section class="cash-exchange-confirm__info">
        <p class="cash-exchange-confirm__subtitle">
          Менеджер свяжется с вами и сообщит:
        </p>

        <ul class="cash-exchange-confirm__list">
          <li class="cash-exchange-confirm__item">
            <span class="cash-exchange-confirm__dot" />
            адрес офиса
          </li>
          <li class="cash-exchange-confirm__item">
            <span class="cash-exchange-confirm__dot" />
            необходимые документы
          </li>
          <li class="cash-exchange-confirm__item">
            <span class="cash-exchange-confirm__dot" />
            согласованное время обмена
          </li>
          <li class="cash-exchange-confirm__item">
            <span class="cash-exchange-confirm__dot" />
            курс сделки
          </li>
        </ul>
      </section>

      <UiButton
        class="cash-exchange-confirm__submit"
        size="large"
        @click="onSubmit"
      >
        Отправить
      </UiButton>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UiButton from 'components/ui/UiButton.vue';
import PageHeader from 'components/PageHeader.vue';
import SuccessOverlay from 'components/SuccessOverlay.vue';

defineOptions({
  name: 'CashExchangeConfirmPage',
});

const showSuccess = ref(false);

function onSubmit() {
  showSuccess.value = true;
}
</script>

<style scoped lang="scss">
.cash-exchange-confirm-page {
  width: 100%;
  min-height: 100%;
  background: var(--ui-surface-page);
}

.cash-exchange-confirm {
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

.cash-exchange-confirm__info {
  padding: 24px 17px 20px;
  background: #fff;
  margin-top: 32px;
  border-radius: 24px;
}

.cash-exchange-confirm__subtitle {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.cash-exchange-confirm__list {

  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 16px;
}

.cash-exchange-confirm__item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.cash-exchange-confirm__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--ui-text-secondary);
}

.cash-exchange-confirm__submit {
  margin-top: 40px;
}
</style>
