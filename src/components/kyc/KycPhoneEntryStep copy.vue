<template>
  <KycStepLayout title="Номер телефона" step="Шаг 1">
    <section class="kyc-phone-entry">
      <p class="kyc-phone-entry__lead">
        На указанный номер мы отправим код подтверждения
      </p>

      <UiInput
        v-model="phone"
        name="kyc-phone"
        placeholder="Введите номер телефона"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        maxlength="16"
      />

      <UiButton class="kyc-phone-entry__submit" :disabled="!canContinue || state.isPhoneCodeLoading" @click="goNext">
        {{ state.isPhoneCodeLoading ? 'Отправка...' : 'Продолжить' }}
      </UiButton>

      <div class="kyc-phone-entry__hint">
        <span class="kyc-phone-entry__hint-icon" aria-hidden="true">i</span>
        <p>Номер телефона должен совпадать с тем, что указан в банках</p>
      </div>

      <div class="kyc-phone-entry__agreements">
        <p class="kyc-phone-entry__agreement">
          <span class="kyc-phone-entry__check" aria-hidden="true" />
          Я принимаю условия <span class="kyc-phone-entry__link">Публичной оферты</span>
        </p>

        <p class="kyc-phone-entry__agreement">
          <span class="kyc-phone-entry__check" aria-hidden="true" />
          Соглашаюсь с <span class="kyc-phone-entry__link">Политикой обработки персональных данных</span>
        </p>
      </div>
    </section>

  </KycStepLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { sendKycPhoneCode } from '@/api/kyc';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiInput from 'components/ui/UiInput.vue';
import { useKycLocalState } from 'components/kyc/useKycLocalState';

defineOptions({
  name: 'KycPhoneEntryStep',
});

const router = useRouter();
const state = useKycLocalState();

function extractPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits[0] === '8') {
    return `7${digits.slice(1, 11)}`;
  }

  if (digits[0] === '9') {
    return `7${digits.slice(0, 10)}`;
  }

  return digits.slice(0, 11);
}

function formatPhone(value: string) {
  const digits = extractPhoneDigits(value);

  if (!digits) {
    return '';
  }

  const country = digits[0] ?? '7';
  const part1 = digits.slice(1, 4);
  const part2 = digits.slice(4, 7);
  const part3 = digits.slice(7, 9);
  const part4 = digits.slice(9, 11);

  let result = `+${country}`;

  if (part1) result += ` ${part1}`;
  if (part2) result += ` ${part2}`;
  if (part3) result += ` ${part3}`;
  if (part4) result += ` ${part4}`;

  return result.slice(0, 16);
}

const phone = computed({
  get: () => state.phone,
  set: (value: string) => {
    state.phone = formatPhone(value);
  },
});

const canContinue = computed(() => extractPhoneDigits(state.phone).length === 11);

function formatPhoneForApi(value: string) {
  const digits = extractPhoneDigits(value);

  return digits ? `+${digits}` : '';
}

async function goNext() {
  if (!canContinue.value) {
    return;
  }

  state.isPhoneCodeLoading = true;

  try {
    state.phone = formatPhone(state.phone.trim());
    await sendKycPhoneCode({ phone: formatPhoneForApi(state.phone) });
    await router.push('/kyc/documents');
  } finally {
    state.isPhoneCodeLoading = false;
  }
}
</script>

<style scoped lang="scss">
.kyc-phone-entry {
  padding-top: 4px;
}

.kyc-phone-entry__lead {
  max-width: 242px;
  margin: 0 auto 22px;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
  text-align: center;
}

.kyc-phone-entry :deep(.ui-input__control) {
  height: 50px;
  min-height: 50px;
  padding-inline: 20px;
  border-radius: 16px;
}

.kyc-phone-entry :deep(.ui-input__label),
.kyc-phone-entry :deep(.ui-input__hint),
.kyc-phone-entry :deep(.ui-input__error) {
  display: none;
}

.kyc-phone-entry__hint {
  margin-top: 42px;
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: start;
  column-gap: 10px;
}

.kyc-phone-entry__submit {
  margin-top: 40px;
}

.kyc-phone-entry__hint p {
  margin: 0;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.kyc-phone-entry__hint-icon {
      width: 16px;
      height: 16px;
  margin-top: 1px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  background: #c3c3c9;
  color: var(--ui-text-inverse);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.kyc-phone-entry__agreements {
  margin-top: 86px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.kyc-phone-entry__agreement {
  margin: 0;
  padding-left: 30px;
  position: relative;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.kyc-phone-entry__check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  background: var(--ui-brand-primary);
}

.kyc-phone-entry__check::before {
  content: "";
  width: 9px;
  height: 5px;
  border-left: 2px solid var(--ui-text-inverse);
  border-bottom: 2px solid var(--ui-text-inverse);
  position: absolute;
  left: 5px;
  top: 5px;
  transform: rotate(-45deg);
}

.kyc-phone-entry__link {
  border-bottom: 1px solid currentColor;
}
</style>
