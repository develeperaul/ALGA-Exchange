<template>
  <div
    class="ui-code-input"
    :class="`ui-code-input--${length}`"
  >
    <label
      v-for="index in length"
      :key="index"
      class="ui-code-input__cell"
    >
      <span class="sr-only">Digit {{ index }}</span>
      <input
        class="ui-code-input__native"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        maxlength="1"
        :value="digits[index - 1]"
        @input="onInput(index - 1, $event)"
      >
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useField } from 'vee-validate';

interface UiCodeInputProps {
  name: string;
  modelValue?: string;
  length?: 5 | 6;
  validateOnMount?: boolean;
}

const props = withDefaults(defineProps<UiCodeInputProps>(), {
  modelValue: '',
  length: 6,
  validateOnMount: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

defineOptions({
  name: 'UiCodeInput',
});

const { value, validate } = useField<string>(
  () => props.name,
  computed(() => (nextValue: string) => {
    const normalized = nextValue.replace(/\D/g, '');

    return normalized.length === props.length || `Введите ${props.length}-значный код`;
  }),
  {
    initialValue: props.modelValue,
    validateOnMount: props.validateOnMount,
    validateOnValueUpdate: true,
  },
);

const digits = computed(() => {
  const normalized = value.value.replace(/\D/g, '').slice(0, props.length);

  return Array.from({ length: props.length }, (_, index) => normalized[index] ?? '');
});

function onInput (index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const nextDigit = input.value.replace(/\D/g, '').slice(-1);
  const nextDigits = digits.value;

  nextDigits[index] = nextDigit;
  const nextValue = nextDigits.join('').slice(0, props.length);

  value.value = nextValue;
  emit('update:modelValue', nextValue);
  void validate();

  if (nextDigit && input.parentElement?.nextElementSibling) {
    const nextInput = input.parentElement.nextElementSibling.querySelector('input');
    nextInput?.focus();
  }
}
</script>

<style scoped lang="scss">
.ui-code-input {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.ui-code-input--5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 15px;
}

.ui-code-input__cell {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.ui-code-input__native {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
