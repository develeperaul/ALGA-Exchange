<template>
  <div class="kyc-upload-grid" :class="{ 'kyc-upload-grid--double': double }">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface KycUploadGridProps {
  double?: boolean;
}

withDefaults(defineProps<KycUploadGridProps>(), {
  double: false,
});

defineOptions({
  name: 'KycUploadGrid',
});
</script>

<style scoped lang="scss">
.kyc-upload-grid {
  display: grid;
  gap: 14px;
}

.kyc-upload-grid--double {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
</style>
