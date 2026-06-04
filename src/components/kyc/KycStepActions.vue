<template>
  <div class="kyc-step-actions">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KycStepActions',
});
</script>

<style scoped lang="scss">
.kyc-step-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
