<template>
  <div
    class="kyc-upload-slot"
    :class="{
      'kyc-upload-slot--uploaded': status === 'uploaded',
      'kyc-upload-slot--compact': compact,
      'kyc-upload-slot--preview': status !== 'idle',
    }"
  >
    <template v-if="status === 'idle'">
      <UiFileInput :accept="accept" :capture="capture" @select="emit('select', $event)">
        <div class="kyc-upload-slot__card">
          <div class="kyc-upload-slot__icon-wrap">
            <span class="kyc-upload-slot__icon" aria-hidden="true" />
          </div>

          <div class="kyc-upload-slot__copy">
            <p class="kyc-upload-slot__title">
              {{ title }}
            </p>
            <p v-if="description" class="kyc-upload-slot__description">
              {{ description }}
            </p>
          </div>
        </div>
      </UiFileInput>
    </template>

    <template v-else>
      <div class="kyc-upload-slot__preview">
        <img class="kyc-upload-slot__image" :src="src" :alt="title">
        <button class="kyc-upload-slot__remove" type="button" aria-label="Удалить" @click="emit('remove')">
          <span aria-hidden="true" />
        </button>

        <div v-if="status === 'uploading'" class="kyc-upload-slot__loading">
          <UiSpinner size="small" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import UiFileInput from 'components/ui/UiFileInput.vue';
import UiSpinner from 'components/ui/UiSpinner.vue';
import type { KycUploadStatus } from 'components/kyc/useKycLocalState';

interface KycUploadSlotProps {
  title: string;
  description?: string;
  src?: string;
  accept?: string;
  capture?: 'user' | 'environment';
  status?: KycUploadStatus;
  compact?: boolean;
}

withDefaults(defineProps<KycUploadSlotProps>(), {
  description: '',
  src: '',
  accept: 'image/*',
  capture: undefined,
  status: 'idle',
  compact: false,
});

const emit = defineEmits<{
  select: [file: File | null];
  remove: [];
}>();

defineOptions({
  name: 'KycUploadSlot',
});
</script>

<style scoped lang="scss">
.kyc-upload-slot {
  width: 100%;
}

.kyc-upload-slot--preview {
  width: 132px;
}

.kyc-upload-slot__card,
.kyc-upload-slot__preview {
  width: 100%;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.kyc-upload-slot__card {
  min-height: 94px;
  padding: 26px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.kyc-upload-slot--compact .kyc-upload-slot__card {
  min-height: 75px;
  padding-top: 16px;
  padding-bottom: 16px;
}

.kyc-upload-slot__icon-wrap {
  width: 43px;
  height: 43px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: var(--ui-brand-light);
}

.kyc-upload-slot__icon {
  width: 18px;
  height: 18px;
  position: relative;
  display: block;
}

.kyc-upload-slot__icon::before,
.kyc-upload-slot__icon::after {
  content: "";
  position: absolute;
  background: var(--ui-brand-dark);
}

.kyc-upload-slot__icon::before {
  width: 2px;
  height: 16px;
  left: 8px;
  top: 1px;
  border-radius: 999px;
}

.kyc-upload-slot__icon::after {
  width: 10px;
  height: 10px;
  left: 4px;
  top: 1px;
  border-top: 2px solid var(--ui-brand-dark);
  border-left: 2px solid var(--ui-brand-dark);
  background: transparent;
  transform: rotate(45deg);
}

.kyc-upload-slot__copy {
  min-width: 0;
}

.kyc-upload-slot__title,
.kyc-upload-slot__description {
  margin: 0;
}

.kyc-upload-slot__title {
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.kyc-upload-slot__description {
  margin-top: 4px;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.kyc-upload-slot__preview {
  height: 94px;
  background: #efe8e1;
}

.kyc-upload-slot__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.kyc-upload-slot__remove {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--ui-surface-white);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
}

.kyc-upload-slot__remove span::before,
.kyc-upload-slot__remove span::after {
  content: "";
  width: 10px;
  height: 1.5px;
  position: absolute;
  top: 9px;
  left: 5px;
  background: var(--ui-text-muted);
}

.kyc-upload-slot__remove span::before {
  transform: rotate(45deg);
}

.kyc-upload-slot__remove span::after {
  transform: rotate(-45deg);
}

.kyc-upload-slot__loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 20%);
}
</style>
