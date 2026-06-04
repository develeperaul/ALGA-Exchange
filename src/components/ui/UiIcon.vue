<template>
  <svg
    class="ui-icon"
    :style="iconStyle"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface UiIconProps {
  name: string;
  size?: string | number;
  color?: string;
}

const props = withDefaults(defineProps<UiIconProps>(), {
  size: 20,
  color: '',
});

defineOptions({
  name: 'UiIcon',
});

const symbolId = computed(() => `#icon-${props.name}`);

const normalizedSize = computed(() => (
  typeof props.size === 'number' ? `${props.size}px` : props.size
));

const iconStyle = computed(() => ({
  width: normalizedSize.value,
  height: normalizedSize.value,
  color: props.color || undefined,
}));
</script>

<style scoped lang="scss">
.ui-icon {
  display: inline-block;
  flex: 0 0 auto;
  color: inherit;
  vertical-align: middle;
  overflow: visible;
}
</style>
