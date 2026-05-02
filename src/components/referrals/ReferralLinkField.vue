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
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 8V6.6C8 5.716 8.716 5 9.6 5H17.4C18.284 5 19 5.716 19 6.6V14.4C19 15.284 18.284 16 17.4 16H16"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
        />
        <rect
          x="5"
          y="8"
          width="11"
          height="11"
          rx="2.2"
          stroke="currentColor"
          stroke-width="1.7"
        />
      </svg>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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
