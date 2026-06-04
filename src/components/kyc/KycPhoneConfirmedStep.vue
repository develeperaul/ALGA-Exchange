<template>
  <KycStepLayout title="" :show-back="false">
    <section class="kyc-phone-confirmed">
      <KycStatusCard title="Телефон подтвержден" :image-src="checkmarkImage" />
    </section>

    <template #footer>
      <UiButton @click="goNext">
        Продолжить
      </UiButton>
    </template>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import KycStatusCard from 'components/kyc/KycStatusCard.vue';
import UiButton from 'components/ui/UiButton.vue';
import checkmarkImage from 'src/assets/kyc/checkmark.svg';

defineOptions({
  name: 'KycPhoneConfirmedStep',
});

const router = useRouter();

function goNext() {
  void router.push('/kyc/documents');
}
</script>

<style scoped lang="scss">
.kyc-phone-confirmed {
  padding-top: 14px;
}
</style>
