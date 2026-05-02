<template>
  <label class="ui-input">
    <span
      v-if="label"
      class="ui-input__label"
    >
      {{ label }}
    </span>

    <span
      class="ui-input__control"
      :class="{ 'ui-input__control--error': shouldShowError }"
    >
      <input
        v-bind="$attrs"
        class="ui-input__native"
        :name="name"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        @input="onInput"
        @blur="handleBlur"
      >

      <span
        v-if="$slots.suffix || suffix"
        class="ui-input__suffix"
      >
        <slot name="suffix">
          {{ suffix }}
        </slot>
      </span>
    </span>

    <span
      v-if="hint && !shouldShowError"
      class="ui-input__hint"
    >
      {{ hint }}
    </span>

    <span
      v-if="shouldShowError"
      class="ui-input__error"
    >
      {{ errorMessage }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useField } from 'vee-validate';

type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';

type ValidationRule = (value: string) => true | string;

interface UiInputProps {
  name: string;
  modelValue?: string;
  rules?: ValidationRule | ValidationRule[];
  label?: string;
  hint?: string;
  suffix?: string;
  placeholder?: string;
  type?: string;
  inputmode?: InputMode;
  autocomplete?: string;
  validateOnMount?: boolean;
}

const props = withDefaults(defineProps<UiInputProps>(), {
  modelValue: '',
  rules: undefined,
  label: '',
  hint: '',
  suffix: '',
  placeholder: '',
  type: 'text',
  inputmode: 'text',
  autocomplete: 'off',
  validateOnMount: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({
  name: 'UiInput',
  inheritAttrs: false,
});

const {
  value,
  errorMessage,
  handleBlur,
  validate,
  meta,
} = useField<string>(
  () => props.name,
  computed(() => props.rules),
  {
    initialValue: props.modelValue,
    validateOnMount: props.validateOnMount,
    validateOnValueUpdate: true,
  },
);

const shouldShowError = computed(() => Boolean(errorMessage.value) && (meta.touched || props.validateOnMount));

watch(
  () => props.modelValue,
  (nextValue) => {
    if (nextValue !== value.value) {
      value.value = nextValue;
    }
  },
);

function onInput (event: Event) {
  const nextValue = (event.target as HTMLInputElement).value;

  value.value = nextValue;
  emit('update:modelValue', nextValue);
  void validate();
}
</script>

<style scoped lang="scss">
.ui-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.ui-input__label {
  margin-bottom: 12px;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
}

.ui-input__control {
  width: 100%;
  height: 50px;
  min-height: 50px;
  padding: 10px 20px;
  border: 1px solid transparent;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.ui-input__control--error {
  border-color: var(--ui-state-error-figma);
}

.ui-input__native {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: var(--ui-letter-spacing);
}

.ui-input__control--error .ui-input__native {
  color: var(--ui-state-error-figma);
}

.ui-input__native::placeholder {
  color: var(--ui-text-muted);
}

.ui-input__suffix {
  flex: 0 0 auto;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
}

.ui-input__hint,
.ui-input__error {
  margin-top: 8px;
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
}

.ui-input__hint {
  color: var(--ui-text-muted);
}

.ui-input__error {
  color: var(--ui-state-error-figma);
}
</style>
