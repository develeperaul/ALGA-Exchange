<template>
  <section class="ref-income" aria-label="Доход">
    <div class="ref-income__header">
      <h2 class="ref-income__title">Доход</h2>
    </div>

    <div class="ref-income__filters" aria-label="Фильтры">
      <button class="ref-income__chip ref-income__chip--active" type="button">
        <span>{{ monthLabel }}</span>
        <span class="ref-income__chip-arrow" aria-hidden="true" />
      </button>
      <button class="ref-income__chip" type="button">
        За все время
      </button>
    </div>

    <div class="ref-income__ring" :aria-label="value">
      <div class="ref-income__ring-inner">
        <span class="ref-income__value">{{ value }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ReferralIncomeCardProps {
  monthLabel?: string;
  value: string;
}

withDefaults(defineProps<ReferralIncomeCardProps>(), {
  monthLabel: 'Апрель',
});

defineOptions({
  name: 'ReferralIncomeCard',
});
</script>

<style scoped lang="scss">
.ref-income {
  width: 100%;
  padding: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.ref-income__header {
  display: block;
}

.ref-income__title {
  margin: 0;
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.ref-income__filters {
  margin-top: 14px;
  display: flex;
  gap: 12px;
}

.ref-income__chip {
  height: 35px;
  padding: 0 16px;
  border: 0;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #F2F2F2;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  cursor: pointer;
}

.ref-income__chip--active {
  background: var(--ui-brand-soft);
  color: var(--ui-text-brand);
}

.ref-income__chip-arrow {
  width: 6px;
  height: 6px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-1px) rotate(45deg);
}

.ref-income__ring {
  width: 135px;
  height: 135px;
  margin: 20px auto 0;
  border-radius: 999px;
  padding: 4px;
  background: conic-gradient(var(--ui-brand-primary) 0 360deg);
}

.ref-income__ring-inner {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ui-surface-page);
}

.ref-income__value {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
}
</style>
