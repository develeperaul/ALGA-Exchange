<template>
  <q-page class="orders-page">
    <main class="orders-screen" aria-label="Мои заявки">
      <header class="orders-header">
        <button class="orders-header__select" type="button">
          <span>Безналичный обмен</span>
          <span class="orders-header__arrow" aria-hidden="true" />
        </button>
      </header>

      <UiTabs
        v-model="activeTab"
        class="orders-tabs"
        :options="tabs"
        aria-label="Фильтр заявок"
      />

      <section class="orders-list" aria-label="Список заявок">
        <RouterLink
          v-for="order in visibleOrders"
          :key="order.id"
          class="orders-list__link"
          :to="`/orders/${order.requestId}`"
        >
          <OrderRequestCard
            :status="order.status"
            :title="order.title"
            :subtitle="order.subtitle"
            :date="order.date"
            :request-id="order.requestId"
            :amount="order.amount"
            :amount-tone="order.amountTone"
            :node-id="order.nodeId"
          />
        </RouterLink>
      </section>

      <section v-if="visibleOrders.length === 0" class="orders-empty" aria-live="polite">
        <div class="orders-empty__illustration" aria-hidden="true">
          <span class="orders-empty__envelope" />
          <span class="orders-empty__flap" />
          <span class="orders-empty__plane" />
        </div>

        <p class="orders-empty__message">
          Активных заявок нет
        </p>

        <UiButton
          class="orders-empty__button"
          size="medium"
          @click="goHome"
        >
          На главную
        </UiButton>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import OrderRequestCard from 'components/orders/OrderRequestCard.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiTabs, { UiTabOption } from 'components/ui/UiTabs.vue';
import { usePaymentsStore } from '@/stores/payments-store';

defineOptions({
  name: 'OrdersPage',
});

const router = useRouter();
const paymentsStore = usePaymentsStore();
const activeTab = ref('active');

const tabs: UiTabOption[] = [
  {
    label: 'Активные',
    value: 'active',
  },
  {
    label: 'Завершенные',
    value: 'completed',
  },
];

const visibleOrders = computed(() => (
  activeTab.value === 'active'
    ? paymentsStore.ordersActive
    : paymentsStore.ordersCompleted
));

function goHome() {
  void router.push('/');
}
</script>

<style scoped lang="scss">
.orders-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.orders-screen {
  width: 100%;
  min-height: calc(100vh - 70px);
  padding:
    calc(24px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(34px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  overflow-x: hidden;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.orders-header {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orders-header__select {
  max-width: 100%;
  height: 30px;
  padding: 0 8px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: transparent;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
  cursor: pointer;
}

.orders-header__arrow {
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
}

.orders-tabs {
  margin-top: 22px;
}

.orders-list {
  margin-top: 20px;
  display: grid;
  gap: 10px;
}

.orders-list__link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.orders-list__link:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 4px;
  border-radius: 16px;
}

.orders-empty {
  margin-top: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orders-empty__illustration {
  width: 146px;
  height: 146px;
  position: relative;
}

.orders-empty__envelope {
  width: 98px;
  height: 70px;
  border-radius: 6px;
  position: absolute;
  left: 23px;
  bottom: 20px;
  background: linear-gradient(145deg, #FFF36E 0%, #F0C51A 100%);
  box-shadow: 0 8px 14px rgb(170 132 0 / 20%);
  transform: rotate(-13deg);
}

.orders-empty__envelope::before,
.orders-empty__envelope::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 6px;
}

.orders-empty__envelope::before {
  clip-path: polygon(0 0, 50% 52%, 100% 0);
  background: rgb(255 255 255 / 24%);
}

.orders-empty__envelope::after {
  clip-path: polygon(0 100%, 50% 42%, 100% 100%);
  background: rgb(170 132 0 / 12%);
}

.orders-empty__flap {
  width: 78px;
  height: 48px;
  border-radius: 5px;
  position: absolute;
  left: 36px;
  bottom: 49px;
  background: linear-gradient(145deg, #FFF87A 0%, #E9BB12 100%);
  clip-path: polygon(0 0, 50% 72%, 100% 0, 86% 100%, 14% 100%);
  transform: rotate(-13deg);
  box-shadow: 0 5px 10px rgb(170 132 0 / 12%);
}

.orders-empty__plane {
  width: 78px;
  height: 58px;
  position: absolute;
  top: 31px;
  right: 12px;
  background: linear-gradient(145deg, #37E06E 0%, #11A94A 100%);
  clip-path: polygon(0 32%, 100% 0, 78% 78%, 52% 53%, 28% 78%);
  filter: drop-shadow(0 7px 8px rgb(0 119 52 / 28%));
  transform: rotate(-10deg);
}

.orders-empty__plane::after {
  content: "";
  width: 48px;
  height: 1.5px;
  position: absolute;
  top: 21px;
  left: 23px;
  background: rgb(255 255 255 / 34%);
  transform: rotate(-22deg);
}

.orders-empty__message {
  margin: 10px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: 0;
  text-align: center;
}

.orders-empty__button {
  margin-top: 40px;
}
</style>
