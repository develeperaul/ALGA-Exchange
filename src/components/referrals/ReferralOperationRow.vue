<template>
  <button class="ref-op" type="button" @click="$emit('select')">
    <span class="ref-op__icon" aria-hidden="true">
      <q-icon :name="isNegative ? 'remove' : 'add'" size="18px" />
    </span>

    <div class="ref-op__text">
      <p class="ref-op__title">{{ title }}</p>
      <p class="ref-op__date">{{ date }}</p>
    </div>

    <p class="ref-op__amount" :class="{ 'ref-op__amount--negative': isNegative }">{{ amount }}</p>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ReferralOperationRowProps {
  title: string;
  date: string;
  amount: string;
}

const props = defineProps<ReferralOperationRowProps>();

defineEmits<{
  select: [];
}>();

defineOptions({
  name: 'ReferralOperationRow',
});

const isNegative = computed(() => props.amount.trim().startsWith('-'));
</script>

<style scoped lang="scss">
.ref-op {
  width: 100%;
  min-height: 60px;
  padding: 10px 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 10px;
  background: var(--ui-surface-white);
  font-family: var(--ui-font-family);
  text-align: left;
  cursor: pointer;
}

.ref-op:active {
  transform: translateY(1px);
}

.ref-op:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.ref-op__icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
}

.ref-op__text {
  min-width: 0;
}

.ref-op__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ref-op__date {
  margin: 2px 0 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ref-op__amount {
  margin: 0;
  color: var(--ui-text-brand);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.ref-op__amount--negative {
  color: var(--ui-text-danger);
}
</style>
