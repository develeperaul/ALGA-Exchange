<template>
  <q-page class="kyc-flow-page">
    <component :is="currentComponent" />
    <KycInfoSheet v-model="kycStore.infoSheetOpen" />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useKycStore } from 'stores/kyc-store';
import KycBlockedStep from 'components/kyc/KycBlockedStep.vue';
import KycDocumentsStep from 'components/kyc/KycDocumentsStep.vue';
import KycInfoSheet from 'components/kyc/KycInfoSheet.vue';
import KycIntroStep from 'components/kyc/KycIntroStep.vue';
import KycPhoneCodeStep from 'components/kyc/KycPhoneCodeStep.vue';
import KycPhoneConfirmedStep from 'components/kyc/KycPhoneConfirmedStep.vue';
import KycPhoneEntryStep from 'components/kyc/KycPhoneEntryStep.vue';
import KycSelfieStep from 'components/kyc/KycSelfieStep.vue';
import KycSendingStep from 'components/kyc/KycSendingStep.vue';
import KycSentStep from 'components/kyc/KycSentStep.vue';

defineOptions({
  name: 'KycFlowPage',
});

const route = useRoute();
const kycStore = useKycStore();

const currentComponent = computed(() => {
  switch (route.path) {
    case '/kyc/phone':
      return KycPhoneEntryStep;
    case '/kyc/phone/code':
      return KycPhoneCodeStep;
    case '/kyc/phone/status':
      return KycPhoneConfirmedStep;
    case '/kyc/documents':
      return KycDocumentsStep;
    case '/kyc/selfie':
      return KycSelfieStep;
    case '/kyc/sending':
      return KycSendingStep;
    case '/kyc/result':
      return KycSentStep;
    case '/kyc/blocked':
      return KycBlockedStep;
    default:
      return KycIntroStep;
  }
});
</script>

<style scoped lang="scss">
.kyc-flow-page {
  width: 100%;
  min-height: 100%;
  padding: 0;
  background: var(--ui-surface-page);
}
</style>
