<template>
  <UiBottomSheet
    :model-value="modelValue"
    title="Для чего нужна KYC-верификация?"
    aria-label="KYC info"
    :closable="false"
    panel-class="kyc-info-sheet__panel"
    content-class="kyc-info-sheet__content"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="kyc-info">
      <p class="kyc-info__text">
        Для безопасности и защиты всех пользователей мы проводим проверку KYC — «Знай своего клиента».
        Это помогает убедиться, что наш сервис не используют для мошенничества, отмывания денег или
        других незаконных действий. Благодаря этому обменнику вы можете быть уверены в честности и
        безопасности операций.
      </p>

      <p class="kyc-info__text">
        Пройдя KYC, вы подтверждаете, что используете сервис честно и открыто. Это ускоряет работу
        сервиса, снижает риски блокировок и обеспечивает комфортное и безопасное пользование.
      </p>

      <UiButton class="kyc-info__close" variant="neutral" size="mini" @click="emit('update:modelValue', false)">
        Закрыть
      </UiButton>
    </div>
  </UiBottomSheet>
</template>

<script setup lang="ts">
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import UiButton from 'components/ui/UiButton.vue';

interface KycInfoSheetProps {
  modelValue: boolean;
}

defineProps<KycInfoSheetProps>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

defineOptions({
  name: 'KycInfoSheet',
});
</script>

<style scoped lang="scss">
.kyc-info {
  padding-bottom: 4px;
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.kyc-info__text {
  margin: 0;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.kyc-info__text + .kyc-info__text {
  margin-top: 18px;
}

.kyc-info__close {
  width: 230px;
  margin: 28px auto 0;
}
</style>
