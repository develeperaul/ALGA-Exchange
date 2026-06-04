<template>
  <div class="ui-select">
    <span
      v-if="label"
      class="ui-select__label"
    >
      {{ label }}
    </span>

    <button
      type="button"
      class="ui-select__trigger"
      :class="{ 'ui-select__trigger--open': isOpen }"
      @click="toggle"
    >
      <span
        class="ui-select__value"
        :class="{ 'ui-select__value--placeholder': !modelValue }"
      >
        {{ displayValue }}
      </span>
      <svg class="ui-select__arrow"
        :class="{ 'ui-select__arrow--open': isOpen }" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_871_13809" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="2" width="10" height="6">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.60845 2.27194C9.36438 2.02108 8.96867 2.02108 8.7246 2.27194L5.00002 6.10012L1.27545 2.27194C1.03138 2.02108 0.635666 2.02108 0.391597 2.27194C0.147529 2.52279 0.147529 2.92951 0.391597 3.18037L5.00002 7.91699L9.60845 3.18037C9.85252 2.92951 9.85252 2.52279 9.60845 2.27194Z" fill="#006FFD"/>
        </mask>
        <g mask="url(#mask0_871_13809)">
        <rect x="0.000244141" y="-0.000976562" width="9.99961" height="9.99977" fill="#95939F"/>
        </g>
      </svg>

      <!-- <svg

        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 4L5 6.5L7.5 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg> -->
    </button>

    <transition name="ui-select-dropdown">
      <div
        v-if="isOpen"
        class="ui-select__dropdown"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="ui-select__option"
          :class="{ 'ui-select__option--selected': modelValue === option.value }"
          @click="select(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface UiSelectOption {
  label: string;
  value: string;
}

interface UiSelectProps {
  modelValue?: string;
  options: UiSelectOption[];
  label?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<UiSelectProps>(), {
  modelValue: '',
  label: '',
  placeholder: 'Выберите',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({
  name: 'UiSelect',
});

const isOpen = ref(false);

const displayValue = computed(() => {
  const selected = props.options.find((o) => o.value === props.modelValue);
  return selected?.label || props.placeholder;
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function select(value: string) {
  emit('update:modelValue', value);
  isOpen.value = false;
}
</script>

<style scoped lang="scss">
.ui-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  position: relative;
}

.ui-select__label {
  margin-bottom: 12px;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
}

.ui-select__trigger {
  width: 100%;
  height: 50px;
  min-height: 50px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  overflow: hidden;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
  cursor: pointer;
  user-select: none;
  transition: border-color 160ms ease;
}

.ui-select__trigger--open {
  border-color: var(--ui-brand-primary);
}

.ui-select__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-select__value--placeholder {
  color: var(--ui-text-muted);
}

.ui-select__arrow {
  flex: 0 0 auto;
  width: 10px;
  height: 10px;
  color: var(--ui-text-secondary);
  transition: transform 160ms ease;
}

.ui-select__arrow--open {
  transform: rotate(180deg);
}

.ui-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  padding: 8px 0;
  border-radius: 16px;
  background: var(--ui-surface-white);
  box-shadow: var(--ui-shadow-card);
  overflow: hidden;
}

.ui-select__option {
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: var(--ui-text-secondary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.ui-select__option:hover {
  background: var(--ui-surface-muted);
  color: var(--ui-text-primary);
}

.ui-select__option--selected {
  color: var(--ui-text-primary);
}

.ui-select-dropdown-enter-active,
.ui-select-dropdown-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}

.ui-select-dropdown-enter-from,
.ui-select-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
