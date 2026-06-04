<template>
  <KycFlowShell title="Верификация в 2 шага" @back="goBack">
    <section class="kyc-intro">
      <p class="kyc-intro__lead">
        Чтобы совершать безналичные переводы, пройдите KYC-верификацию - подтвердите личность
      </p>

      <div class="kyc-intro__card">
        <span class="kyc-intro__badge">01</span>
        <p>Требуется номер телефона</p>
      </div>

      <div class="kyc-intro__card kyc-intro__card--large">
        <span class="kyc-intro__badge">02</span>
        <div>
          <p>Фото паспорта</p>
          <p>(главный разворот + регистрация)</p>
          <p>Ваше фото-селфи</p>
        </div>
      </div>
    </section>

    <template #footer>
      <KycStepActions>
        <UiButton @click="goPhone">
          Пройти верификацию
        </UiButton>

        <UiButton variant="neutral" class="kyc-intro__info-button" @click="openInfo">
          <span class="kyc-intro__info-icon" aria-hidden="true">i</span>
          Узнать подробнее
        </UiButton>
      </KycStepActions>
    </template>
  </KycFlowShell>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import KycFlowShell from 'components/kyc/KycFlowShell.vue';
import KycStepActions from 'components/kyc/KycStepActions.vue';
import UiButton from 'components/ui/UiButton.vue';
import { useKycStore } from 'stores/kyc-store';

defineOptions({
  name: 'KycIntroStep',
});

const router = useRouter();
const kycStore = useKycStore();

function goBack() {
  const hasBack = Boolean((window.history.state as { back?: unknown } | null)?.back);

  if (hasBack) {
    router.back();
    return;
  }

  void router.replace('/profile');
}

function goPhone() {
  void router.push('/kyc/phone');
}

function openInfo() {
  kycStore.infoSheetOpen = true;
}
</script>

<style scoped lang="scss">
.kyc-intro {
  padding-top: 8px;
}

.kyc-intro__lead {
  margin: 0;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.kyc-intro__card {
  min-height: 62px;
  margin-top: 20px;
  padding: 16px;
  border-radius: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--ui-surface-white);
}

.kyc-intro__card--large {
  min-height: 105px;
  margin-top: 12px;
}

.kyc-intro__badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  background: var(--ui-brand-light);
  color: var(--ui-brand-dark);
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
}

.kyc-intro__card p {
  margin: 0;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.kyc-intro__card p + p {
  margin-top: 10px;
}

.kyc-intro__info-button {
  background: var(--ui-brand-light);
  color: var(--ui-brand-dark);
}

.kyc-intro__info-button:hover:not(:disabled),
.kyc-intro__info-button:active:not(:disabled) {
  background: var(--ui-brand-light);
}

.kyc-intro__info-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  background: var(--ui-brand-dark);
  color: var(--ui-text-inverse);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}
</style>
