<template>
  <label class="ui-checkbox">
    <input
      class="ui-checkbox__native"
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
    >
    <span class="ui-checkbox__control" aria-hidden="true">
      <span class="ui-checkbox__mark" />
    </span>
    <span v-if="$slots.default || label" class="ui-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
interface UiCheckboxProps {
  modelValue?: boolean;
  label?: string;
}

withDefaults(defineProps<UiCheckboxProps>(), {
  modelValue: false,
  label: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

defineOptions({
  name: 'UiCheckbox',
});

function onChange (event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).checked);
}
</script>

<style scoped lang="scss">
.ui-checkbox {
  width: 100%;
  display: grid;
  grid-template-columns: 20px 1fr;
  column-gap: 10px;
  align-items: start;
  color: var(--ui-text-muted);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  cursor: pointer;
}

.ui-checkbox__native {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.ui-checkbox__control {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-brand-primary);
}

.ui-checkbox__mark {
  width: 9px;
  height: 5px;
  border-bottom: 2px solid var(--ui-text-inverse);
  border-left: 2px solid var(--ui-text-inverse);
  transform: rotate(-45deg) translate(1px, -1px);
}

.ui-checkbox__native:focus-visible + .ui-checkbox__control {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.ui-checkbox__native:not(:checked) + .ui-checkbox__control {
  background: var(--ui-surface-white);
  box-shadow: inset 0 0 0 1px var(--ui-border-subtle);
}

.ui-checkbox__native:not(:checked) + .ui-checkbox__control .ui-checkbox__mark {
  opacity: 0;
}

.ui-checkbox__label {
  min-width: 0;
}

.ui-checkbox__label :deep(a) {
  color: var(--ui-text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
