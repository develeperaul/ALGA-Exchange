<template>
  <KycStepLayout title="Фото-селфи" step="Шаг 2">
    <section class="kyc-selfie">
      <p class="kyc-selfie__lead">
        Сфотографируйте лицо. Фото должно быть четким, без очков и головных уборов.
      </p>

      <KycUploadSlot
        v-if="selfie.status === 'idle'"
        title="Сделайте селфи"
        description="(камера откроется на телефоне)"
        capture="user"
        @select="selectSelfie"
      />

      <div v-else class="kyc-selfie__preview">
        <img :src="selfie.previewUrl" alt="Селфи">
        <button type="button" aria-label="Удалить" @click="removeSelfie">
          <span aria-hidden="true" />
        </button>
      </div>
    </section>

    <template #footer>
      <UiButton :disabled="selfie.status !== 'uploaded'" @click="goNext">
        Далее
      </UiButton>
    </template>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { deletePassport, uploadPassport } from '@/api/kyc';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import KycUploadSlot from 'components/kyc/KycUploadSlot.vue';
import UiButton from 'components/ui/UiButton.vue';
import { useKycStore } from 'stores/kyc-store';

defineOptions({
  name: 'KycSelfieStep',
});

const router = useRouter();
const kycStore = useKycStore();
const selfie = computed(() => kycStore.selfie);

async function selectSelfie(file: File | null) {
  if (!file) {
    return;
  }

  kycStore.selfie.status = 'uploading';

  if (kycStore.selfie.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(kycStore.selfie.previewUrl);
  }

  const previewUrl = URL.createObjectURL(file);

  try {
    const response = await uploadPassport({ media: file, type: 2 });

    kycStore.selfie.file = file;
    kycStore.selfie.previewUrl = previewUrl;
    kycStore.selfie.remoteId = response.data.id;
    kycStore.selfie.status = 'uploaded';
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    kycStore.selfie.status = 'idle';
    throw error;
  }
}

async function removeSelfie() {
  if (kycStore.selfie.remoteId) {
    await deletePassport(kycStore.selfie.remoteId);
  }

  if (kycStore.selfie.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(kycStore.selfie.previewUrl);
  }

  kycStore.selfie.remoteId = '';
  kycStore.selfie.file = null;
  kycStore.selfie.previewUrl = '';
  kycStore.selfie.status = 'idle';
}

function goNext() {

  if (kycStore.selfie.status !== 'uploaded') {
    return;
  }
  console.log('sss');

  void router.push('/kyc/sending');
}
</script>

<style scoped lang="scss">
.kyc-selfie {
  padding-top: 4px;
}

.kyc-selfie__lead {
  margin: 0 0 24px;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.kyc-selfie__preview {
  width: 100%;
  aspect-ratio: 343 / 260;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.kyc-selfie__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.kyc-selfie__preview button {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgb(255 255 255 / 90%);
}

.kyc-selfie__preview span::before,
.kyc-selfie__preview span::after {
  content: "";
  width: 12px;
  height: 2px;
  position: absolute;
  top: 13px;
  left: 8px;
  background: var(--ui-text-muted);
}

.kyc-selfie__preview span::before {
  transform: rotate(45deg);
}

.kyc-selfie__preview span::after {
  transform: rotate(-45deg);
}
</style>
