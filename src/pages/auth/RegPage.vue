<template>
  <main class="auth-page" aria-label="Регистрация">
    <section class="auth-screen">
      <button
        class="auth-screen__back"
        type="button"
        aria-label="Назад"
        @click="goBack"
      >
        <span class="auth-screen__back-icon" aria-hidden="true" />
      </button>

      <form class="auth-screen__form" @submit.prevent="submit">
        <template v-if="step === 'email'">
          <h1 class="auth-screen__title">
            Войти
          </h1>
          <p class="auth-screen__text auth-screen__text--email">
            На указанную почту мы отправим код подтверждения
          </p>

          <UiInput
            v-model="email"
            class="auth-screen__input auth-screen__input--email"
            name="auth-email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="Введите e-mail"
            :disabled="authStore.isLoading"
          />

          <UiButton
            class="auth-screen__button auth-screen__button--email"
            size="large"
            type="submit"
            :disabled="!canSubmitEmail || authStore.isLoading"
          >
            {{ authStore.isLoading ? 'Отправка...' : 'Продолжить' }}
          </UiButton>

          <div class="auth-screen__agreements">
            <UiCheckbox v-model="termsAccepted">
              Я принимаю условия <a href="#" @click.prevent>Публичной оферты</a>
            </UiCheckbox>
            <UiCheckbox v-model="policyAccepted">
              Соглашаюсь с <a href="#" @click.prevent>Политикой обработки персональных данных</a>
            </UiCheckbox>
          </div>
        </template>

        <template v-else-if="step === 'code'">
          <h1 class="auth-screen__title">
            Введите код
          </h1>
          <p class="auth-screen__text auth-screen__text--code">
            На почту {{ displayEmail }} мы отправили код
          </p>

          <UiInput
            v-model="code"
            class="auth-screen__input auth-screen__input--code"
            name="auth-code"
            inputmode="numeric"
            autocomplete="one-time-code"
            placeholder="Введите код"
            :disabled="authStore.isLoading"
          />

          <UiButton
            class="auth-screen__button auth-screen__button--code"
            size="large"
            type="submit"
            :disabled="!canSubmitCode || authStore.isLoading"
          >
            {{ authStore.isLoading ? 'Проверка...' : 'Продолжить' }}
          </UiButton>

          <button class="auth-screen__resend" type="button">
            Не пришел код?
          </button>
        </template>

        <template v-else>
          <h1 class="auth-screen__title auth-screen__title--password">
            Придумайте пароль для быстрого входа
          </h1>

          <UiInput
            v-model="password"
            class="auth-screen__input auth-screen__input--password"
            name="auth-password"
            :type="isPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Введите пароль"
            :disabled="authStore.isLoading"
          >
            <template #suffix>
              <button
                class="auth-screen__visibility"
                type="button"
                aria-label="Показать пароль"
                @click="isPasswordVisible = !isPasswordVisible"
              >
                <span class="auth-screen__visibility-icon" aria-hidden="true" />
              </button>
            </template>
          </UiInput>

          <UiInput
            v-model="passwordRepeat"
            class="auth-screen__input auth-screen__input--password-repeat"
            name="auth-password-repeat"
            :type="isPasswordRepeatVisible ? 'text' : 'password'"
            autocomplete="new-password"
            placeholder="Повторите пароль"
            :disabled="authStore.isLoading"
          >
            <template #suffix>
              <button
                class="auth-screen__visibility"
                type="button"
                aria-label="Показать повтор пароля"
                @click="isPasswordRepeatVisible = !isPasswordRepeatVisible"
              >
                <span class="auth-screen__visibility-icon" aria-hidden="true" />
              </button>
            </template>
          </UiInput>

          <UiButton
            class="auth-screen__button auth-screen__button--password"
            size="large"
            type="submit"
            :disabled="!canSubmitPassword || authStore.isLoading"
          >
            {{ authStore.isLoading ? 'Сохранение...' : 'Продолжить' }}
          </UiButton>
        </template>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import UiCheckbox from 'components/ui/UiCheckbox.vue';
import UiInput from 'components/ui/UiInput.vue';
import { useAuthStore } from 'stores/auth-store';

type AuthStep = 'email' | 'code' | 'password';

defineOptions({
  name: 'RegPage',
});

const router = useRouter();
const authStore = useAuthStore();

const mockEmail = 'pochta123@mail.ru';

const step = ref<AuthStep>('email');
const email = ref(authStore.email);
const code = ref('');
const password = ref('');
const passwordRepeat = ref('');
const termsAccepted = ref(true);
const policyAccepted = ref(true);
const isPasswordVisible = ref(false);
const isPasswordRepeatVisible = ref(false);

const displayEmail = computed(() => email.value.trim() || mockEmail);
const canSubmitEmail = computed(() => Boolean(email.value.trim()) && termsAccepted.value && policyAccepted.value);
const canSubmitCode = computed(() => Boolean(code.value.trim()));
const canSubmitPassword = computed(() => Boolean(password.value) && password.value === passwordRepeat.value);

function goBack () {
  if (step.value === 'password') {
    step.value = 'code';
    return;
  }

  if (step.value === 'code') {
    step.value = 'email';
    return;
  }

  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/');
}

async function submit () {
  if (step.value === 'email' && canSubmitEmail.value) {
    try {
      const normalizedEmail = email.value.trim();

      await authStore.sendRegisterCode(normalizedEmail);
      email.value = normalizedEmail;
      step.value = 'code';
    } catch {
      return;
    }

    return;
  }

  if (step.value === 'code' && canSubmitCode.value) {
    try {
      const normalizedCode = code.value.trim();

      await authStore.checkRegisterCode(normalizedCode);
      code.value = normalizedCode;
      step.value = 'password';
    } catch {
      return;
    }

    return;
  }

  if (step.value === 'password' && canSubmitPassword.value) {
    try {
      await authStore.setRegisterPassword(password.value);
      void router.push('/');
    } catch {
      return;
    }
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.auth-screen {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.auth-screen__back {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  position: absolute;
  top: calc(16px + var(--ui-safe-area-top));
  left: calc(16px + var(--ui-safe-area-left));
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-surface-white);
  cursor: pointer;
}

.auth-screen__back-icon {
  width: 9px;
  height: 9px;
  border-bottom: 2px solid var(--ui-text-muted);
  border-left: 2px solid var(--ui-text-muted);
  transform: rotate(45deg) translate(2px, -1px);
}

.auth-screen__form {
  width: 100%;
  min-height: 100vh;
  position: relative;
  padding:
    calc(72px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
}

.auth-screen__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.auth-screen__title--password {
  max-width: 280px;
}

.auth-screen__text {
  margin: 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.auth-screen__text--email {
  margin-top: 25px;
}

.auth-screen__text--code {
  margin-top: 20px;
}

.auth-screen__input {
  width: 100%;
}

.auth-screen__input :deep(.ui-input__control) {
  height: 50px;
}

.auth-screen__input--email,
.auth-screen__input--code {
  margin-top: 58px;
}

.auth-screen__input--password {
  margin-top: 80px;
}

.auth-screen__input--password-repeat {
  margin-top: 12px;
}

.auth-screen__button {
  width: 100%;
}

.auth-screen__button--email {
  margin-top: 24px;
}

.auth-screen__button--code {
  margin-top: 30px;
}

.auth-screen__button--password {
  margin-top: 24px;
}

.auth-screen__agreements {
  margin-top: 24px;
  display: grid;
  gap: 20px;
}

.auth-screen__resend {
  margin-top: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ui-text-muted);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  cursor: pointer;
}

.auth-screen__visibility {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
}

.auth-screen__visibility-icon {
  width: 18px;
  height: 12px;
  border: 1.7px solid currentColor;
  border-radius: 999px / 75%;
  position: relative;
  display: block;
  color: var(--ui-text-muted);
}

.auth-screen__visibility-icon::before,
.auth-screen__visibility-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  transform: translate(-50%, -50%);
}

.auth-screen__visibility-icon::before {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.auth-screen__visibility-icon::after {
  width: 22px;
  height: 1.7px;
  background: currentColor;
  transform: translate(-50%, -50%) rotate(-28deg);
  opacity: 0;
}
</style>
