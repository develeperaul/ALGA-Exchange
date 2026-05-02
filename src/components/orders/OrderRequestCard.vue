<template>
  <article
    class="order-request-card"
    :data-node-id="nodeId"
  >
    <span
      class="order-request-card__status"
      :class="`order-request-card__status--${status}`"
    >
      {{ statusLabel }}
    </span>

    <time class="order-request-card__date">
      {{ date }}
    </time>

    <h3 class="order-request-card__title">
      {{ title }}
    </h3>

    <p class="order-request-card__subtitle">
      {{ subtitle }}
    </p>

    <p
      class="order-request-card__amount"
      :class="`order-request-card__amount--${amountTone}`"
    >
      {{ amount }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type OrderRequestStatus = 'processing' | 'completed' | 'cancelled';

interface OrderRequestCardProps {
  status: OrderRequestStatus;
  title: string;
  subtitle: string;
  date: string;
  amount: string;
  amountTone?: 'default' | 'danger';
  nodeId?: string;
}

const props = withDefaults(defineProps<OrderRequestCardProps>(), {
  amountTone: 'default',
  nodeId: '',
});

defineOptions({
  name: 'OrderRequestCard',
});

const statusLabel = computed(() => {
  const labels: Record<OrderRequestStatus, string> = {
    processing: 'В обработке',
    completed: 'Исполнена',
    cancelled: 'Отменена',
  };

  return labels[props.status];
});
</script>

<style scoped lang="scss">
.order-request-card {
  width: 100%;
  height: 104px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 9px 0 rgb(0 0 0 / 5%);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.order-request-card__status {
  height: 24px;
  padding: 0 16px;
  border-radius: 30px;
  position: absolute;
  top: 14px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-text-inverse);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
}

.order-request-card__status--processing {
  background: #FBEB0F;
  color: var(--ui-text-primary);
}

.order-request-card__status--completed {
  background: var(--ui-brand-primary);
}

.order-request-card__status--cancelled {
  background: #FB3E0F;
}

.order-request-card__date {
  position: absolute;
  top: 18px;
  right: 20px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
}

.order-request-card__title {
  max-width: calc(100% - 150px);
  margin: 0;
  position: absolute;
  top: 48px;
  left: 20px;
  overflow: hidden;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-request-card__subtitle {
  max-width: calc(100% - 150px);
  margin: 0;
  position: absolute;
  top: 72px;
  left: 20px;
  overflow: hidden;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-request-card__amount {
  margin: 0;
  position: absolute;
  top: 48px;
  right: 20px;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
}

.order-request-card__amount--danger {
  color: #FB3E0F;
}
</style>
