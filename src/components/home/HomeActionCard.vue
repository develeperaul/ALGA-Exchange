<template>
  <component
    :is="cardComponent"
    class="home-action-card"
    v-bind="cardAttrs"
    data-node-id="578:2748"
    @click="handleClick"
  >
    <span class="home-action-card__icon" data-node-id="578:2750" aria-hidden="true">
      <img
        v-if="icon"
        class="home-action-card__icon-asset"
        :src="icon"
        alt=""
      >
      <span v-else class="home-action-card__money" />
    </span>

    <span class="home-action-card__label" data-node-id="578:2749">
      {{ text }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface HomeActionCardProps {
  icon?: string;
  text?: string;
  to?: RouteLocationRaw | null;
}

const props = withDefaults(defineProps<HomeActionCardProps>(), {
  icon: '',
  text: 'Наличный обмен',
  to: null,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

defineOptions({
  name: 'HomeActionCard',
});

const cardComponent = computed(() => (props.to ? RouterLink : 'button'));

const cardAttrs = computed(() => {
  if (props.to) {
    return {
      to: props.to,
    };
  }

  return {
    type: 'button',
  };
});

function handleClick(event: MouseEvent) {
  if (!props.to) {
    emit('click', event);
  }
}
</script>

<style scoped lang="scss">
.home-action-card {
  width: 100%;
  height: 90px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid var(--ui-brand-primary);
  border-radius: var(--ui-radius-sheet);
  position: relative;
  overflow: hidden;
  display: block;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 9px rgb(0 0 0 / 5%);
  cursor: pointer;
  text-decoration: none;
}

.home-action-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  top: 11px;
  left: 50%;
  display: grid;
  place-items: center;
  background: var(--ui-brand-primary);
  transform: translateX(-50%);
}

.home-action-card__money {
  width: 18px;
  height: 18px;
  position: relative;
  display: block;
}

.home-action-card__icon-asset {
  width: 18px;
  height: 18px;
  display: block;
  object-fit: contain;
}

.home-action-card__money::before {
  content: "";
  width: 16px;
  height: 10px;
  border: 2px solid var(--ui-surface-white);
  border-radius: 3px;
  position: absolute;
  top: 4px;
  left: 1px;
}

.home-action-card__money::after {
  content: "";
  width: 4px;
  height: 4px;
  border-radius: 50%;
  position: absolute;
  top: 7px;
  left: 7px;
  background: var(--ui-surface-white);
}

.home-action-card__label {
  width: calc(100% - 40px);
  position: absolute;
  top: 61px;
  left: 20px;
  overflow: hidden;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
