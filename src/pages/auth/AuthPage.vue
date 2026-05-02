<template>
  <main class="auth-page" aria-label="Авторизация">
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
          />

          <UiButton
            class="auth-screen__button auth-screen__button--email"
            size="large"
            type="submit"
            :disabled="!canSubmitEmail"
          >
            Продолжить
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
          />

          <UiButton
            class="auth-screen__button auth-screen__button--code"
            size="large"
            type="submit"
            :disabled="!canSubmitCode"
          >
            Продолжить
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
            :disabled="!canSubmitPassword"
          >
            Продолжить
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

type AuthStep = 'email' | 'code' | 'password';

defineOptions({
  name: 'AuthPage',
});

const router = useRouter();

const mockEmail = 'pochta123@mail.ru';

const step = ref<AuthStep>('email');
const email = ref('');
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

function submit () {
  if (step.value === 'email' && canSubmitEmail.value) {
    step.value = 'code';
    return;
  }

  if (step.value === 'code' && canSubmitCode.value) {
    step.value = 'password';
    return;
  }

  if (step.value === 'password' && canSubmitPassword.value) {
    void router.push('/');
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
  width: 100%;
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
  text-align: center;
}

.auth-screen__title--password {
  max-width: 217px;
  margin: 0 auto;
}

.auth-screen__text {
  margin: 16px auto 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: center;
}

.auth-screen__text--email {
  max-width: 281px;
}

.auth-screen__text--code {
  max-width: 221px;
}

.auth-screen__input {
  width: 100%;
}

.auth-screen__input :deep(.ui-input__control) {
  border-radius: 16px;
}

.auth-screen__input--email,
.auth-screen__input--code {
  margin-top: 30px;
}

.auth-screen__input--password {
  margin-top: 24px;
}

.auth-screen__input--password-repeat {
  margin-top: 16px;
}

.auth-screen__button {
  width: 100%;
}

.auth-screen__button--email {
  margin-top: 40px;
}

.auth-screen__button--code {
  margin-top: 34px;
}

.auth-screen__button--password {
  margin-top: 40px;
}

.auth-screen__agreements {
  width: 100%;
  margin-top: 84px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.auth-screen__resend {
  width: 100%;
  margin-top: 38px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ui-text-muted);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  cursor: pointer;
}

.auth-screen__visibility {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.auth-screen__visibility-icon {
  width: 21px;
  height: 12px;
  border-bottom: 2px solid currentColor;
  border-radius: 0 0 14px 14px;
  position: relative;
}

.auth-screen__visibility-icon::before,
.auth-screen__visibility-icon::after {
  content: '';
  width: 2px;
  height: 5px;
  border-radius: 2px;
  position: absolute;
  bottom: -1px;
  background: currentColor;
}

.auth-screen__visibility-icon::before {
  left: 2px;
  transform: rotate(-45deg);
}

.auth-screen__visibility-icon::after {
  right: 2px;
  transform: rotate(45deg);
}
</style>
