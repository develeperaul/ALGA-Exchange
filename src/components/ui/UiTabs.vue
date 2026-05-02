<template>
  <div class="ui-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="option in options"
      :key="option.value"
      class="ui-tabs__item"
      :class="{ 'ui-tabs__item--active': option.value === modelValue }"
      type="button"
      role="tab"
      :aria-selected="option.value === modelValue"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface UiTabOption {
  label: string;
  value: string;
}

interface UiTabsProps {
  modelValue: string;
  options?: UiTabOption[];
  ariaLabel?: string;
}

withDefaults(defineProps<UiTabsProps>(), {
  options: () => [
    { label: 'Вывод', value: 'withdraw' },
    { label: 'Пополнение', value: 'deposit' },
  ],
  ariaLabel: 'Content switcher',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({
  name: 'UiTabs',
});
</script>

<style scoped lang="scss">
.ui-tabs {
  width: 100%;
  height: 45px;
  padding: 4px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-surface-white);
  isolation: isolate;
}

.ui-tabs__item {
  min-width: 0;
  height: 100%;
  flex: 1 1 0;
  padding: 8px 12px;
  border: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-surface-white);
  color: var(--ui-text-secondary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: normal;
  font-weight: 400;
  letter-spacing: 0;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease;
}

.ui-tabs__item--active {
  background: var(--ui-brand-light);
  color: var(--ui-text-brand);
  font-weight: 600;
}

.ui-tabs__item:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}
</style>
