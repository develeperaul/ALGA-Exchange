<template>
  <section class="ref-balance" aria-label="Реферальный счет">
    <div class="ref-balance__header">
      <h2 class="ref-balance__title">
        Реферальный счет
      </h2>
      <UiIcon name="arrow-right" size="14" color="var(--ui-text-icon)" class="ref-balance__chevron"/>
    </div>

    <div class="ref-balance__row" aria-label="Баланс">
      <span class="ref-balance__amount">{{ amount }}</span>
      <span class="ref-balance__currency">{{ currency }}</span>
    </div>

    <UiButton class="ref-balance__button" size="large" @click="router.push('/referrals/account')">
      Вывести
    </UiButton>
  </section>
</template>

<script setup lang="ts">
import UiButton from 'components/ui/UiButton.vue';
import UiIcon from 'components/ui/UiIcon.vue';
import { useRouter } from 'vue-router';

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

const router = useRouter()
</script>

<style scoped lang="scss">
.ref-balance {
  width: 100%;
  padding: 0;
}

.ref-balance__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  flex-shrink: 0;
}

.ref-balance__row {
  margin-top: 12px;
  height: 50px;
  padding: 10px 20px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  background: #E8EBED;
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

.ref-balance__button :deep(.ui-button) {
  --ui-button-bg: #1ED74B;
  --ui-button-bg-hover: #19B23E;
  --ui-button-bg-active: #19B23E;
}
</style>
