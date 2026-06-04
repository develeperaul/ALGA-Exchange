<template>
  <span class="ui-spinner" :class="[`ui-spinner--${size}`]" aria-hidden="true" />
</template>

<script setup lang="ts">
interface UiSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

withDefaults(defineProps<UiSpinnerProps>(), {
  size: 'medium',
});

defineOptions({
  name: 'UiSpinner',
});
</script>

<style scoped lang="scss">
.ui-spinner {
  width: 56px;
  height: 56px;
  border: 3px solid rgb(30 215 75 / 20%);
  border-top-color: var(--ui-brand-primary);
  border-radius: 50%;
  display: inline-block;
  animation: ui-spinner-rotate 0.75s linear infinite;
}

.ui-spinner--small {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.ui-spinner--large {
  width: 100px;
  height: 100px;
  border-width: 4px;
}

@keyframes ui-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
