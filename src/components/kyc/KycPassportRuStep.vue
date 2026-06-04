<template>
  <KycStepLayout title="Верификация по паспорту">
    <section class="kyc-passport">
      <div class="kyc-passport__section">
        <h3>Страна выдачи</h3>
        <KycDocTypeSelector v-model="selectedCountry" />
      </div>

      <div class="kyc-passport__section">
        <h3>Паспорт</h3>

        <KycUploadGrid :double="showPreviewGrid">
          <KycUploadSlot
            v-if="frontStatus === 'idle'"
            title="Загрузите главный разворот"
            description="(страница с фото)"
            :status="frontStatus"
            @select="selectFront"
          />
          <KycUploadSlot
            v-else
            title="Главный разворот"
            :src="frontPreview"
            :status="frontStatus"
            @remove="removeFront"
          />
          <KycUploadSlot
            v-if="registrationStatus === 'idle'"
            title="Загрузите регистрацию"
            description="(страница с адресом)"
            :status="registrationStatus"
            @select="selectRegistration"
          />
          <KycUploadSlot
            v-else
            title="Регистрация"
            :src="registrationPreview"
            :status="registrationStatus"
            @remove="removeRegistration"
          />
        </KycUploadGrid>
      </div>

      <div class="kyc-passport__timer">
        <span class="kyc-passport__timer-icon" aria-hidden="true" />
        28:09
      </div>
    </section>

    <template #footer>
      <UiButton v-if="canContinue" @click="goNext">
        Далее
      </UiButton>
    </template>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { deletePassport, uploadPassport } from '@/api/kyc';
import KycDocTypeSelector from 'components/kyc/KycDocTypeSelector.vue';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import KycUploadGrid from 'components/kyc/KycUploadGrid.vue';
import KycUploadSlot from 'components/kyc/KycUploadSlot.vue';
import UiButton from 'components/ui/UiButton.vue';
import passportSample from 'src/assets/kyc/passport-sample.png';
import { useKycStore } from 'stores/kyc-store';
import type { KycUploadValue } from 'components/kyc/useKycLocalState';

defineOptions({
  name: 'KycPassportRuStep',
});

const router = useRouter();
const kycStore = useKycStore();

const selectedCountry = computed({
  get: () => kycStore.selectedCountry,
  set: (value: 'RU' | 'FOREIGN') => {
    kycStore.selectedCountry = value;
    if (value === 'FOREIGN') {
      void router.replace('/kyc/documents?type=foreign');
    }
  },
});

const frontPreview = computed(() => kycStore.documents.passportFront.previewUrl || passportSample);
const registrationPreview = computed(() => kycStore.documents.passportRegistration.previewUrl || passportSample);
const frontStatus = computed(() => kycStore.documents.passportFront.status);
const registrationStatus = computed(() => kycStore.documents.passportRegistration.status);
const showPreviewGrid = computed(() => frontStatus.value !== 'idle' && registrationStatus.value !== 'idle');
const canContinue = computed(
  () => kycStore.documents.passportFront.status === 'uploaded' && kycStore.documents.passportRegistration.status === 'uploaded',
);

async function updateUpload(target: KycUploadValue, file: File | null, type: 0 | 1) {
  if (!file) {
    return;
  }

  target.status = 'uploading';

  if (target.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(target.previewUrl);
  }

  const previewUrl = URL.createObjectURL(file);

  try {
    const response = await uploadPassport({ media: file, type });

    target.file = file;
    target.previewUrl = previewUrl;
    target.remoteId = response.data.id;
    target.status = 'uploaded';
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    target.status = 'idle';
    throw error;
  }
}

async function clearUpload(target: KycUploadValue) {
  if (target.remoteId) {
    await deletePassport(target.remoteId);
  }

  if (target.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(target.previewUrl);
  }

  target.remoteId = '';
  target.file = null;
  target.previewUrl = '';
  target.status = 'idle';
}

async function selectFront(file: File | null) {
  await updateUpload(kycStore.documents.passportFront, file, 0);
}

async function selectRegistration(file: File | null) {
  await updateUpload(kycStore.documents.passportRegistration, file, 1);
}

async function removeFront() {
  await clearUpload(kycStore.documents.passportFront);
}

async function removeRegistration() {
  await clearUpload(kycStore.documents.passportRegistration);
}

function goNext() {
  if (!canContinue.value) {
    return;
  }

  void router.push('/kyc/selfie');
}
</script>

<style scoped lang="scss">
.kyc-passport {
  padding-top: 4px;
}

.kyc-passport__section + .kyc-passport__section {
  margin-top: 28px;
}

.kyc-passport__section h3 {
  margin: 0 0 14px;
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.kyc-passport__timer {
  position: fixed;
  left: 16px;
  bottom: calc(24px + var(--ui-safe-area-bottom));
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.kyc-passport__timer-icon {
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 50%;
  position: relative;
  opacity: 0.8;
}

.kyc-passport__timer-icon::before,
.kyc-passport__timer-icon::after {
  content: "";
  position: absolute;
  left: 9px;
  background: currentColor;
  border-radius: 999px;
}

.kyc-passport__timer-icon::before {
  width: 2px;
  height: 5px;
  top: 4px;
}

.kyc-passport__timer-icon::after {
  width: 4px;
  height: 2px;
  top: 9px;
}
</style>
