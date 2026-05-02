<template>
  <button
    v-bind="$attrs"
    class="ui-button"
    :class="[`ui-button--${size}`, `ui-button--${variant}`]"
    :type="type"
    :disabled="disabled"
  >
    <span class="ui-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
export type UiButtonSize = 'large' | 'medium' | 'mini';
export type UiButtonVariant = 'primary' | 'neutral';

interface UiButtonProps {
  size?: UiButtonSize;
  variant?: UiButtonVariant;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

withDefaults(defineProps<UiButtonProps>(), {
  size: 'medium',
  variant: 'primary',
  type: 'button',
  disabled: false,
});

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
});
</script>

<style scoped lang="scss">
.ui-button {
  width: var(--ui-button-width);
  max-width: 100%;
  height: var(--ui-button-height);
  min-height: var(--ui-button-height);
  padding: 10px;
  border: 0;
  border-radius: var(--ui-radius-button);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-button-bg);
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-button);
  font-weight: var(--ui-button-font-weight);
  line-height: var(--ui-line-button);
  letter-spacing: var(--ui-letter-spacing);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 160ms ease,
    opacity 160ms ease,
    transform 160ms ease;
}

.ui-button:hover:not(:disabled) {
  background: var(--ui-button-bg-hover);
}

.ui-button:active:not(:disabled) {
  background: var(--ui-button-bg-active);
  transform: translateY(1px);
}

.ui-button:focus-visible {
  outline: 2px solid var(--ui-border-focus);
  outline-offset: 2px;
}

.ui-button:disabled {
  cursor: default;
  opacity: 0.64;
}

.ui-button__content {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-button--large {
  --ui-button-width: 100%;
  --ui-button-height: 50px;
  --ui-button-font-weight: 600;
}

.ui-button--medium {
  --ui-button-width: 100%;
  --ui-button-height: 50px;
  --ui-button-font-weight: 600;
}

.ui-button--mini {
  --ui-button-width: 100%;
  --ui-button-height: 45px;
  --ui-button-font-weight: 500;
}

.ui-button--primary {
  --ui-button-bg: var(--ui-brand-primary);
  --ui-button-bg-hover: var(--ui-brand-hover);
  --ui-button-bg-active: var(--ui-brand-active);
}

.ui-button--neutral {
  --ui-button-bg: var(--ui-text-neutral);
  --ui-button-bg-hover: #686868;
  --ui-button-bg-active: #5F5F5F;
}
</style>
