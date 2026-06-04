<template>
  <KycStepLayout title="" :show-back="false">
    <section class="kyc-status-screen">
      <KycStatusCard
        title="Данные отправлены"
        description="Нам потребуется немного времени для проверки"
        :image-src="planeImage"
      />
    </section>

    <template #footer>
      <UiButton @click="goHome">
        На главную
      </UiButton>
    </template>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import KycStatusCard from 'components/kyc/KycStatusCard.vue';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import UiButton from 'components/ui/UiButton.vue';
import planeImage from 'src/assets/kyc/sent-plane.svg';

defineOptions({
  name: 'KycSentStep',
});

const router = useRouter();

function goHome() {
  void router.replace('/');
}
</script>

<style scoped lang="scss">
.kyc-status-screen {
  padding-top: 18px;
}
</style>
