<template>
  <section class="ref-balance" aria-label="Реферальный счет">
    <h2 class="ref-balance__title">
      Реферальный счет
    </h2>
    <span class="ref-balance__chevron" aria-hidden="true" />

    <div class="ref-balance__row" aria-label="Баланс">
      <span class="ref-balance__amount">{{ amount }}</span>
      <span class="ref-balance__currency">{{ currency }}</span>
    </div>

    <UiButton class="ref-balance__button" size="large">
      Вывести
    </UiButton>
  </section>
</template>

<script setup lang="ts">
import UiButton from 'components/ui/UiButton.vue';

interface ReferralBalanceCardProps {
  amount: string;
  currency?: string;
}

withDefaults(defineProps<ReferralBalanceCardProps>(), {
  currency: 'USDT',
});

defineOptions({
  name: 'ReferralBalanceCard',
});
</script>

<style scoped lang="scss">
.ref-balance {
  width: 100%;
  padding: 0;
  border-radius: 16px;
  position: relative;
  background: var(--ui-surface-white);
}

.ref-balance__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.ref-balance__chevron {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 0;
  right: 0;
  color: var(--ui-text-muted);
}

.ref-balance__chevron::before {
  content: "";
  width: 7px;
  height: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translate(-50%, -50%) rotate(-45deg);
}

.ref-balance__row {
  margin-top: 12px;
  height: 50px;
  padding: 10px 20px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  background: var(--ui-surface-page);
}

.ref-balance__amount {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: 0;
}

.ref-balance__currency {
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.ref-balance__button {
  margin-top: 24px;
}
</style>
