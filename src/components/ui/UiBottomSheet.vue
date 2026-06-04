<template>
  <teleport :to="teleportTarget">
    <transition name="ui-bottom-sheet-fade">
      <div
        v-if="modelValue"
        class="ui-bottom-sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        @keydown.esc="onEsc"
      >
        <div class="ui-bottom-sheet__backdrop" @click="onBackdropClick" />

        <transition name="ui-bottom-sheet-slide">
          <section
            class="ui-bottom-sheet__panel"
            :class="panelClass"
            :style="{ '--ui-bottom-sheet-max-height': maxHeight }"
            @click.stop
          >
            <div v-if="showHandle" class="ui-bottom-sheet__handle" aria-hidden="true" />

            <header v-if="$slots.header || title || closable" class="ui-bottom-sheet__header">
              <slot name="header">
                <h2 v-if="title" class="ui-bottom-sheet__title">
                  {{ title }}
                </h2>
              </slot>

              <button
                v-if="closable"
                class="ui-bottom-sheet__close"
                type="button"
                aria-label="Закрыть"
                @click="close"
              >
                <span class="ui-bottom-sheet__close-icon" aria-hidden="true" />
              </button>
            </header>

            <div class="ui-bottom-sheet__content" :class="contentClass">
              <slot />
            </div>

            <footer v-if="$slots.footer" class="ui-bottom-sheet__footer">
              <slot name="footer" />
            </footer>
          </section>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

interface UiBottomSheetProps {
  modelValue: boolean;
  title?: string;
  ariaLabel?: string;
  maxHeight?: string;
  closable?: boolean;
  persistent?: boolean;
  showHandle?: boolean;
  panelClass?: string;
  contentClass?: string;
}

const props = withDefaults(defineProps<UiBottomSheetProps>(), {
  title: '',
  ariaLabel: 'Bottom sheet',
  maxHeight: '95vh',
  closable: true,
  persistent: false,
  showHandle: true,
  panelClass: '',
  contentClass: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

defineOptions({
  name: 'UiBottomSheet',
});

const teleportTarget = computed(() => document.querySelector('.app-device-screen') ? '.app-device-screen' : 'body');

function close() {
  emit('update:modelValue', false);
}

function onBackdropClick() {
  if (!props.persistent) {
    close();
  }
}

function onEsc() {
  if (!props.persistent) {
    close();
  }
}

function lockBodyScroll(locked: boolean) {
  if (locked) {
    document.documentElement.classList.add('ui-bottom-sheet-lock');
    document.body.classList.add('ui-bottom-sheet-lock');
  } else {
    document.documentElement.classList.remove('ui-bottom-sheet-lock');
    document.body.classList.remove('ui-bottom-sheet-lock');
  }
}

watch(
  () => props.modelValue,
  (open) => lockBodyScroll(open),
  { immediate: true },
);

onBeforeUnmount(() => {
  lockBodyScroll(false);
});
</script>

<style scoped lang="scss">
.ui-bottom-sheet {
  position: fixed;
  inset: 0;
  z-index: 4000;
  display: grid;
  align-items: end;
}

.ui-bottom-sheet__backdrop {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 30%);
}

.ui-bottom-sheet__panel {
  width: 100%;
  max-height: var(--ui-bottom-sheet-max-height);
  box-sizing: border-box;
  padding: 8px 16px calc(16px + var(--ui-safe-area-bottom));
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--ui-surface-white);
  box-shadow: 0 -10px 30px rgb(0 0 0 / 16%);
}

.ui-bottom-sheet__handle {
  width: 54px;
  height: 5px;
  margin: 0 auto 10px;
  border-radius: 999px;
  background: rgb(0 0 0 / 12%);
}

.ui-bottom-sheet__header {
  min-height: 34px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px;
  align-items: center;
  column-gap: 10px;
}

.ui-bottom-sheet__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.ui-bottom-sheet__close {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.ui-bottom-sheet__close:active {
  transform: translateY(1px);
}

.ui-bottom-sheet__close:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.ui-bottom-sheet__close-icon {
  width: 14px;
  height: 14px;
  position: relative;
  display: block;
}

.ui-bottom-sheet__close-icon::before,
.ui-bottom-sheet__close-icon::after {
  content: "";
  width: 14px;
  height: 2px;
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 0;
  background: currentColor;
}

.ui-bottom-sheet__close-icon::before {
  transform: rotate(45deg);
}

.ui-bottom-sheet__close-icon::after {
  transform: rotate(-45deg);
}

.ui-bottom-sheet__content {
  min-height: 0;
  max-height: calc(var(--ui-bottom-sheet-max-height) - 80px);
  margin-top: 10px;
  flex: 0 1 auto;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.ui-bottom-sheet__footer {
  margin-top: 12px;
}

.ui-bottom-sheet-fade-enter-active,
.ui-bottom-sheet-fade-leave-active {
  transition: opacity 160ms ease;
}

.ui-bottom-sheet-fade-enter-from,
.ui-bottom-sheet-fade-leave-to {
  opacity: 0;
}

.ui-bottom-sheet-slide-enter-active,
.ui-bottom-sheet-slide-leave-active {
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.ui-bottom-sheet-slide-enter-from,
.ui-bottom-sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>

<style>
html.ui-bottom-sheet-lock,
body.ui-bottom-sheet-lock {
  overflow: hidden;
  touch-action: none;
}
</style>
