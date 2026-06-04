<template>
  <KycPassportForeignStep v-if="isForeign" />
  <KycPassportRuStep v-else />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import KycPassportForeignStep from 'components/kyc/KycPassportForeignStep.vue';
import KycPassportRuStep from 'components/kyc/KycPassportRuStep.vue';
import { useKycStore } from 'stores/kyc-store';

defineOptions({
  name: 'KycDocumentsStep',
});

const route = useRoute();
const kycStore = useKycStore();

const isForeign = computed(() => route.query.type === 'foreign' || kycStore.selectedCountry === 'FOREIGN');

watch(
  isForeign,
  (value) => {
    kycStore.selectedCountry = value ? 'FOREIGN' : 'RU';
  },
  { immediate: true },
);
</script>
