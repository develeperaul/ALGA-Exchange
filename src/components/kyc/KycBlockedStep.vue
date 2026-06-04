<template>
  <KycStepLayout title="" :show-back="false">
    <section class="kyc-status-screen">
      <KycStatusCard title="Ваш аккаунт заблокирован" :image-src="blockedImage" />
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
import blockedImage from 'src/assets/kyc/blocked-x.png';

defineOptions({
  name: 'KycBlockedStep',
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
