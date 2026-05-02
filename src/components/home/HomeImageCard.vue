<template>
  <article
    class="home-image-card"
    :style="{ '--home-image-card-height': `${height}px` }"
    :aria-label="label"
  >
    <img
      class="home-image-card__image"
      :src="src"
      :alt="alt"
    >
  </article>
</template>

<script setup lang="ts">
interface HomeImageCardProps {
  src: string;
  label: string;
  alt?: string;
  height?: number;
}

withDefaults(defineProps<HomeImageCardProps>(), {
  alt: '',
  height: 100,
});

defineOptions({
  name: 'HomeImageCard',
});
</script>

<style scoped lang="scss">
.home-image-card {
  width: 100%;
  height: var(--home-image-card-height);
  border-radius: var(--ui-radius-card);
  overflow: hidden;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 9px 0 rgb(0 0 0 / 5%);
}

.home-image-card__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
