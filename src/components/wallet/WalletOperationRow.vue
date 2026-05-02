<template>
  <article class="wallet-op">
    <span class="wallet-op__icon" aria-hidden="true">
      <span
        class="wallet-op__badge"
        :class="direction === 'in' ? 'wallet-op__badge--in' : 'wallet-op__badge--out'"
      >
        <svg
          class="wallet-op__arrow"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 3.2v9.6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M5.6 10.2 9 13.6 12.4 10.2"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </span>

    <div class="wallet-op__text">
      <p class="wallet-op__title">{{ title }}</p>
      <p class="wallet-op__subtitle">{{ subtitle }}</p>
    </div>

    <div class="wallet-op__right">
      <p class="wallet-op__amount" :class="{ 'wallet-op__amount--positive': tone === 'positive' }">
        {{ amount }}
      </p>
      <p class="wallet-op__date">{{ date }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
export type WalletOpTone = 'default' | 'positive';
export type WalletOpDirection = 'in' | 'out';

interface WalletOperationRowProps {
  direction: WalletOpDirection;
  title: string;
  subtitle: string;
  amount: string;
  tone?: WalletOpTone;
  date: string;
}

withDefaults(defineProps<WalletOperationRowProps>(), {
  tone: 'default',
});

defineOptions({
  name: 'WalletOperationRow',
});
</script>

<style scoped lang="scss">
.wallet-op {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 10px;
}

.wallet-op__badge {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ui-brand-soft);
  color: var(--ui-text-brand);
}

.wallet-op__badge--in .wallet-op__arrow {
  transform: rotate(180deg);
}

.wallet-op__text {
  min-width: 0;
}

.wallet-op__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-op__subtitle {
  margin: 2px 0 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wallet-op__right {
  text-align: right;
}

.wallet-op__amount {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
}

.wallet-op__amount--positive {
  color: var(--ui-text-brand);
}

.wallet-op__date {
  margin: 2px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
}
</style>
