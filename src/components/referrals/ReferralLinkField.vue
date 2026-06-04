<template>
  <section class="ref-link-field" aria-label="Реферальная ссылка">
    <span class="ref-link-field__text">
      {{ value }}
    </span>

    <button
      class="ref-link-field__copy"
      :class="{ 'ref-link-field__copy--copied': copied }"
      type="button"
      :aria-label="copyLabel"
      @click="copy"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_892_4010)">
<path d="M15.5789 4H7.36842C6.61579 4 6 4.65455 6 5.45455V15.6364H7.36842V5.45455H15.5789V4ZM17.6316 6.90909H10.1053C9.35263 6.90909 8.73684 7.56364 8.73684 8.36364V18.5455C8.73684 19.3455 9.35263 20 10.1053 20H17.6316C18.3842 20 19 19.3455 19 18.5455V8.36364C19 7.56364 18.3842 6.90909 17.6316 6.90909ZM17.6316 18.5455H10.1053V8.36364H17.6316V18.5455Z" fill="#95939F"/>
</g>
<defs>
<clipPath id="clip0_892_4010">
<rect width="18" height="18" fill="white" transform="translate(3 3)"/>
</clipPath>
</defs>
</svg>

    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { notifySuccess } from '@/utils/notify';

interface ReferralLinkFieldProps {
  value: string;
}

const props = defineProps<ReferralLinkFieldProps>();

defineOptions({
  name: 'ReferralLinkField',
});

const copied = ref(false);
let copiedTimer: number | undefined;

const copyLabel = computed(() => (
  copied.value ? 'Скопировано' : 'Скопировать ссылку'
));

async function copy() {
  const textToCopy = props.value.trim();
  if (!textToCopy) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.setAttribute('readonly', 'true');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  notifySuccess('Скопировано');

  copied.value = true;
  if (copiedTimer) {
    window.clearTimeout(copiedTimer);
  }
  copiedTimer = window.setTimeout(() => {
    copied.value = false;
  }, 1200);
}
</script>

<style scoped lang="scss">
.ref-link-field {
  width: 100%;
  height: 50px;
  padding: 0 16px 0 20px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  column-gap: 10px;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 9px 0 rgb(0 0 0 / 5%);
}

.ref-link-field__text {
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ref-link-field__copy {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.ref-link-field__copy--copied {
  color: var(--ui-text-brand);
}

.ref-link-field__copy:active {
  transform: translateY(1px);
}

.ref-link-field__copy:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}
</style>
