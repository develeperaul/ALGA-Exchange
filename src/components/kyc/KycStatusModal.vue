<template>
  <UiBottomSheet
    v-model="isOpen"
    :show-handle="false"
    :closable="false"
    panel-class="kyc-status-modal__panel"
  >
    <div class="kyc-status-modal">
      <div class="kyc-status-modal__header">
        <div class="kyc-status-modal__title-row">
          <div class="kyc-status-modal__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5998 10.7002L20.1998 9.1002C19.8998 8.8002 19.6998 8.2002 19.6998 7.8002V6.20019C19.6998 5.10019 18.7998 4.3002 17.7998 4.3002H16.0998C15.6998 4.3002 15.0998 4.1002 14.7998 3.8002L13.1998 2.4002C12.4998 1.8002 11.3998 1.8002 10.6998 2.4002L9.1998 3.8002C8.8998 4.1002 8.2998 4.3002 7.8998 4.3002H6.1998C5.0998 4.3002 4.2998 5.20019 4.2998 6.20019V7.9002C4.2998 8.3002 4.0998 8.90019 3.7998 9.20019L2.4998 10.8002C1.8998 11.5002 1.8998 12.6002 2.4998 13.3002L3.7998 14.9002C4.0998 15.2002 4.2998 15.8002 4.2998 16.2002V17.9002C4.2998 19.0002 5.1998 19.8002 6.1998 19.8002H7.8998C8.2998 19.8002 8.8998 20.0002 9.1998 20.3002L10.7998 21.7002C11.4998 22.3002 12.5998 22.3002 13.2998 21.7002L14.8998 20.3002C15.1998 20.0002 15.7998 19.8002 16.1998 19.8002H17.8998C18.9998 19.8002 19.7998 18.9002 19.7998 17.9002V16.2002C19.7998 15.8002 19.9998 15.2002 20.2998 14.9002L21.6998 13.3002C22.1998 12.6002 22.1998 11.4002 21.5998 10.7002ZM16.1998 10.1002L11.3998 14.9002C11.2998 15.0002 11.0998 15.1002 10.8998 15.1002C10.6998 15.1002 10.4998 15.0002 10.3998 14.9002L7.9998 12.5002C7.6998 12.2002 7.6998 11.7002 7.9998 11.4002C8.2998 11.1002 8.7998 11.1002 9.0998 11.4002L10.9998 13.3002L15.0998 9.0002C15.3998 8.70019 15.8998 8.70019 16.1998 9.0002C16.4998 9.3002 16.4998 9.8002 16.1998 10.1002Z" :fill="iconColor"/>
              <path d="M16.1998 10.1002L11.3998 14.9002C11.2998 15.0002 11.0998 15.1002 10.8998 15.1002C10.6998 15.1002 10.4998 15.0002 10.3998 14.9002L7.9998 12.5002C7.6998 12.2002 7.6998 11.7002 7.9998 11.4002C8.2998 11.1002 8.7998 11.1002 9.0998 11.4002L10.9998 13.3002L15.0998 9.0002C15.3998 8.70019 15.8998 8.70019 16.1998 9.0002C16.4998 9.3002 16.4998 9.8002 16.1998 10.1002Z" fill="#262626"/>
            </svg>
          </div>
          <span class="kyc-status-modal__title">Верификация аккаунта</span>
        </div>
        
        <div class="kyc-status-modal__badge">
          <span class="kyc-status-modal__badge-text">{{ badgeText }}</span>
        </div>
        
        <p class="kyc-status-modal__description">{{ description }}</p>
      </div>

      <button
        class="kyc-status-modal__close-btn"
        type="button"
        @click="isOpen = false"
      >
        Закрыть
      </button>
    </div>
  </UiBottomSheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import type { KycCardStatus } from './KycStatusCard.vue';

interface Props {
  modelValue: boolean;
  status: KycCardStatus;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const badgeTextMap: Record<KycCardStatus, string> = {
  pending: 'Документы на проверке',
  rejected: 'Верификация не пройдена',
  approved: 'Успешно пройдена',
};

const badgeText = computed(() => badgeTextMap[props.status]);

const descriptionMap: Record<KycCardStatus, string> = {
  pending: 'Проверка документов занимает до 24 ч.',
  rejected: 'Личность не подтверждена. Пройдите верификацию повторно.',
  approved: 'Личность подтверждена. Переходите к выгодным безналичным обменам',
};

const description = computed(() => descriptionMap[props.status]);

const badgeColorMap: Record<KycCardStatus, { bg: string; text: string }> = {
  pending: { bg: '#FBEB0F', text: '#262626' },
  rejected: { bg: '#FEE2E2', text: '#E5484D' },
  approved: { bg: '#D4F5DC', text: '#19B23E' },
};

const badgeColor = computed(() => badgeColorMap[props.status]);

const iconColorMap: Record<KycCardStatus, string> = {
  pending: '#FBEB0F',
  rejected: '#E5484D',
  approved: '#19B23E',
};

const iconColor = computed(() => iconColorMap[props.status]);

defineOptions({
  name: 'KycStatusModal',
});
</script>

<style scoped lang="scss">
.kyc-status-modal__panel {
  padding: 0;
  border-radius: 20px 20px 0 0;
}

.kyc-status-modal {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: var(--ui-surface-white);
}

.kyc-status-modal__header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kyc-status-modal__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kyc-status-modal__title {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.kyc-status-modal__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.kyc-status-modal__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 16px;
  border-radius: 30px;
  background: v-bind('badgeColor.bg');
}

.kyc-status-modal__badge-text {
  color: v-bind('badgeColor.text');
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-weight: 400;
  letter-spacing: 0;
}

.kyc-status-modal__description {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.kyc-status-modal__close-btn {
  width: 100%;
  height: 45px;
  padding: 10px;
  border: 0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #727272;
  color: var(--ui-text-inverse);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
  letter-spacing: -0.3px;
  cursor: pointer;
}
</style>
