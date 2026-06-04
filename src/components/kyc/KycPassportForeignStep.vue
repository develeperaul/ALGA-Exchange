<template>
  <KycStepLayout title="Верификация по паспорту">
    <section class="kyc-passport">
      <div class="kyc-passport__section">
        <h3>Страна выдачи</h3>
        <KycDocTypeSelector v-model="selectedCountry" />
      </div>

      <div class="kyc-passport__section">
        <h3>Паспорт</h3>
        <KycUploadSlot
          v-if="passportStatus === 'idle'"
          title="Загрузите главный разворот"
          description="(страница с фото)"
          compact
          @select="selectPassport"
        />
        <KycUploadSlot
          v-else
          title="Главный разворот"
          :src="passportPreview"
          :status="passportStatus"
          @remove="removePassport"
        />
      </div>

      <div class="kyc-passport__section">
        <h3>Адрес регистрации</h3>
        <UiInput
          v-model="address"
          name="kyc-address"
          placeholder="Заполните поле точно как в паспорте"
        />
      </div>

      <div class="kyc-passport__timer">
        <span class="kyc-passport__timer-icon" aria-hidden="true" />
        29:26
      </div>
    </section>

    <template #footer>
      <UiButton :disabled="!canContinue" @click="goNext">
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
import KycUploadSlot from 'components/kyc/KycUploadSlot.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiInput from 'components/ui/UiInput.vue';
import passportSample from 'src/assets/kyc/passport-sample.png';
import { useKycStore } from 'stores/kyc-store';

defineOptions({
  name: 'KycPassportForeignStep',
});

const router = useRouter();
const kycStore = useKycStore();

const selectedCountry = computed({
  get: () => kycStore.selectedCountry,
  set: (value: 'RU' | 'FOREIGN') => {
    kycStore.selectedCountry = value;
    if (value === 'RU') {
      void router.replace('/kyc/documents');
    }
  },
});

const passportPreview = computed(() => kycStore.documents.foreignPassport.previewUrl || passportSample);
const passportStatus = computed(() => kycStore.documents.foreignPassport.status);
const address = computed({
  get: () => kycStore.documents.address,
  set: (value: string) => {
    kycStore.documents.address = value;
  },
});
const canContinue = computed(
  () => kycStore.documents.foreignPassport.status === 'uploaded' && kycStore.documents.address.trim().length > 0,
);

async function selectPassport(file: File | null) {
  if (!file) {
    return;
  }

  kycStore.documents.foreignPassport.status = 'uploading';

  if (kycStore.documents.foreignPassport.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(kycStore.documents.foreignPassport.previewUrl);
  }

  const previewUrl = URL.createObjectURL(file);

  try {
    const response = await uploadPassport({ media: file, type: 0 });

    kycStore.documents.foreignPassport.file = file;
    kycStore.documents.foreignPassport.previewUrl = previewUrl;
    kycStore.documents.foreignPassport.remoteId = response.data.id;
    kycStore.documents.foreignPassport.status = 'uploaded';
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    kycStore.documents.foreignPassport.status = 'idle';
    throw error;
  }
}

async function removePassport() {
  if (kycStore.documents.foreignPassport.remoteId) {
    await deletePassport(kycStore.documents.foreignPassport.remoteId);
  }

  if (kycStore.documents.foreignPassport.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(kycStore.documents.foreignPassport.previewUrl);
  }

  kycStore.documents.foreignPassport.remoteId = '';
  kycStore.documents.foreignPassport.file = null;
  kycStore.documents.foreignPassport.previewUrl = '';
  kycStore.documents.foreignPassport.status = 'idle';
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
