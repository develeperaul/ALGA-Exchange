<template>
  <article
    class="ref-promo"
    :class="{ 'ref-promo--influencer': variant === 'influencer' }"
    :aria-label="title"
  >
    <p class="ref-promo__title">
      {{ title }}
    </p>

    <div v-if="image || $slots.image" class="ref-promo__image" aria-hidden="true">
      <slot name="image">
        <img :src="image" alt="">
      </slot>
    </div>
  </article>
</template>

<script setup lang="ts">
interface ReferralPromoCardProps {
  title: string;
  image?: string;
  variant?: 'default' | 'influencer';
}

withDefaults(defineProps<ReferralPromoCardProps>(), {
  image: '',
  variant: 'default',
});

defineOptions({
  name: 'ReferralPromoCard',
});
</script>

<style scoped lang="scss">
.ref-promo {
  width: 100%;
  height: 66px;
  padding: 10px 20px;
  border-radius: 16px;
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  background: var(--ui-surface-white);
}

.ref-promo--influencer {
  height: 80px;
}

.ref-promo__title {
  max-width: 214px;
  margin: 0;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: 0;
}

.ref-promo__image {
  position: absolute;
  right: 22px;
  top: -17px;
  width: 83px;
  height: 83px;
  display: grid;
  place-items: center;
}

.ref-promo--influencer .ref-promo__image {
  right: 11px;
  top: -7px;
  width: 102px;
  height: 83px;
}

.ref-promo__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
