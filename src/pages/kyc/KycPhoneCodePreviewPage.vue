<template>
  <q-page>
    <KycStepLayout title="Проверка личности" step="Подтверждение телефона">
      <section class="kyc-code-preview">
        <p role="status">Предпросмотр — SMS и запросы не отправляются.</p>
        <p>Введите код подтверждения из SMS.</p>
        <UiInput v-model="code" name="preview-onboarding-otp" label="Код из SMS"
          inputmode="numeric" autocomplete="off" maxlength="64" />
        <UiButton disabled>Подтвердить телефон</UiButton>
        <UiButton variant="neutral" disabled>Отправить SMS повторно</UiButton>
        <p>Повторная SMS доступна не ранее чем через 60 секунд. Действуют ограничения на число SMS и попыток ввода кода.</p>
        <RouterLink to="/kyc">Вернуться к текущей проверке</RouterLink>
      </section>
    </KycStepLayout>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import KycStepLayout from 'components/kyc/KycStepLayout.vue';
import UiInput from 'components/ui/UiInput.vue';
import UiButton from 'components/ui/UiButton.vue';

const code = ref('');
</script>

<style scoped>
.kyc-code-preview { display: flex; flex-direction: column; gap: 20px; padding-bottom: 32px; }
.kyc-code-preview p { margin: 0; }
</style>
