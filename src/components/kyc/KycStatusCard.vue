<template>
  <section class="kyc-status-card">
    <div class="kyc-status-card__visual">
      <div class="kyc-status-card__visual-base" />
      <img v-if="imageSrc" class="kyc-status-card__image" :src="imageSrc" :alt="title">
      <slot v-else name="visual" />
    </div>

    <h2 class="kyc-status-card__title">
      {{ title }}
    </h2>

    <p v-if="description" class="kyc-status-card__description">
      {{ description }}
    </p>
  </section>
</template>

<script setup lang="ts">
interface KycStatusCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
}

withDefaults(defineProps<KycStatusCardProps>(), {
  description: '',
  imageSrc: '',
});

defineOptions({
  name: 'KycStatusCard',
});
</script>

<style scoped lang="scss">
.kyc-status-card {
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.kyc-status-card__visual {
  width: 221px;
  height: 158px;
  position: relative;
}

.kyc-status-card__visual-base {
  width: 150px;
  height: 105px;
  border-radius: 22px;
  position: absolute;
  left: 50%;
  top: 48px;
  background: var(--ui-surface-white);
  transform: translateX(-50%);
  box-shadow: 0 24px 54px rgb(24 29 24 / 10%);
}

.kyc-status-card__image {
  width: 146px;
  height: auto;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.kyc-status-card__title {
  margin: 20px 0 0;
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.kyc-status-card__description {
  max-width: 267px;
  margin: 12px 0 0;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}
</style>
