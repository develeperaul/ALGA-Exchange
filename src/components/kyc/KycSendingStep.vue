<template>
  <KycStepLayout title="" :show-back="false">
    <section class="kyc-sending">
      <UiSpinner size="large" />
      <h2>Отправляем данные на проверку</h2>
    </section>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { registerKyc } from '@/api/kyc';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import UiSpinner from 'components/ui/UiSpinner.vue';
import { useKycStore } from 'stores/kyc-store';

defineOptions({
  name: 'KycSendingStep',
});

const router = useRouter();
const kycStore = useKycStore();

function formatPhoneForApi(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits ? `+${digits}` : '';
}

onMounted(() => {
  void (async () => {
    kycStore.isRegistering = true;

    try {
      await registerKyc({
        passport_type: kycStore.selectedCountry === 'FOREIGN' ? 'other' : 'ru',
        phone: formatPhoneForApi(kycStore.phone),
        code: kycStore.code,
        address: kycStore.selectedCountry === 'FOREIGN'
          ? kycStore.documents.address.trim()
          : null,
      });

      await router.replace('/kyc/result');
    } catch {
      await router.replace('/kyc/selfie');
    } finally {
      kycStore.isRegistering = false;
    }
  })();
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
