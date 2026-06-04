<template>
  <KycStepLayout title="Введите код" step="Шаг 1">
    <section class="kyc-phone-code">
      <p class="kyc-phone-code__lead">
        На номер {{ phoneLabel }} мы отправили код
      </p>

      <div class="kyc-phone-code__input">
        <UiCodeInput v-model="code" name="kyc-phone-code" :length="6" />
      </div>
    </section>

    <template #footer>
      <KycStepActions>
        <UiButton :disabled="code.length !== 6 || kycStore.isPhoneCodeLoading" @click="goNext">
          {{ kycStore.isPhoneCodeLoading ? 'Отправка...' : 'Продолжить' }}
        </UiButton>

        <button class="kyc-phone-code__resend" type="button" :disabled="kycStore.isPhoneCodeLoading" @click="resendCode">
          Не пришел код?
        </button>
      </KycStepActions>
    </template>
  </KycStepLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { sendKycPhoneCode } from '@/api/kyc';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import KycStepActions from 'components/kyc/KycStepActions.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiCodeInput from 'components/ui/UiCodeInput.vue';
import { useKycStore } from 'stores/kyc-store';

defineOptions({
  name: 'KycPhoneCodeStep',
});

const router = useRouter();
const kycStore = useKycStore();

const phoneLabel = computed(() => kycStore.phone || '+7 927 000 00 00');
const code = computed({
  get: () => kycStore.code,
  set: (value: string) => {
    kycStore.code = value;
  },
});

function goNext() {
  if (kycStore.code.length !== 6 || kycStore.isPhoneCodeLoading) {
    return;
  }

  void router.push('/kyc/phone/status');
}

function formatPhoneForApi(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  return digits ? `+${digits}` : '';
}

async function resendCode() {
  if (kycStore.isPhoneCodeLoading) {
    return;
  }

  kycStore.isPhoneCodeLoading = true;

  try {
    await sendKycPhoneCode({ phone: formatPhoneForApi(kycStore.phone) });
  } finally {
    kycStore.isPhoneCodeLoading = false;
  }
}
</script>

<style scoped lang="scss">
.kyc-phone-code {
  padding-top: 6px;
}

.kyc-phone-code__lead {
  max-width: 221px;
  margin: 0 auto;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
  text-align: center;
}

.kyc-phone-code__input {
  margin-top: 44px;
}

.kyc-phone-code__input :deep(.ui-code-input) {
  gap: 8px;
}

.kyc-phone-code__input :deep(.ui-code-input__cell) {
  height: 50px;
  border: 1px solid transparent;
  border-radius: 10px;
}

.kyc-phone-code__input :deep(.ui-code-input__cell:first-child) {
  border-color: var(--ui-brand-primary);
}

.kyc-phone-code__input :deep(.ui-code-input__cell:focus-within) {
  border-color: var(--ui-brand-primary);
}

.kyc-phone-code__resend {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}
</style>
