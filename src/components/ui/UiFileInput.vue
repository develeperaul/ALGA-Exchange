<template>
  <div class="ui-file-input">
    <input
      :id="inputId"
      ref="inputRef"
      class="ui-file-input__native"
      type="file"
      :accept="accept"
      :capture="capture"
      @change="onChange"
    >

    <button
      type="button"
      class="ui-file-input__trigger"
      :disabled="disabled"
      @click="open"
    >
      <slot />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface UiFileInputProps {
  accept?: string;
  capture?: 'user' | 'environment';
  disabled?: boolean;
}

withDefaults(defineProps<UiFileInputProps>(), {
  accept: '',
  capture: undefined,
  disabled: false,
});

const emit = defineEmits<{
  select: [file: File | null];
}>();

defineOptions({
  name: 'UiFileInput',
});

const inputRef = ref<HTMLInputElement | null>(null);
const inputId = `ui-file-input-${Math.random().toString(36).slice(2, 9)}`;

function open() {
  inputRef.value?.click();
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('select', target.files?.[0] ?? null);
  target.value = '';
}
</script>

<style scoped lang="scss">
.ui-file-input {
  width: 100%;
}

.ui-file-input__native {
  display: none;
}

.ui-file-input__trigger {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.ui-file-input__trigger:disabled {
  cursor: default;
}
</style>
