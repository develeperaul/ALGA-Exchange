<template>
  <KycStepLayout title="" :show-back="false">
    <section class="kyc-sending">
      <UiSpinner size="large" />
      <h2>Отправляем данные на проверку</h2>
    </section>
  </KycStepLayout>
</template>

<script setup lang="ts">
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import UiSpinner from 'components/ui/UiSpinner.vue';

defineOptions({
  name: 'KycSendingStep',
});
</script>

<style scoped lang="scss">
.kyc-sending {
  min-height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.kyc-sending h2 {
  max-width: 221px;
  margin: 24px 0 0;
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
  text-align: center;
}
</style>
