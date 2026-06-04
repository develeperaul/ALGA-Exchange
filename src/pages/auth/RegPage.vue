<template>
  <main class="auth-page" aria-label="Регистрация">
    <section class="auth-screen">
      <button
        class="auth-screen__back"
        type="button"
        aria-label="Назад"
        @click="goBack"
      >
        <UiIcon name="back" size="24" color="var(--ui-text-icon)"/>
      </button>

      <form class="auth-screen__form" @submit.prevent="submit">
        <template v-if="step === 'email'">
          <div class=" tw-grid tw-gap-4 tw-text-center tw-mb-[30px]">

            <h1 class="auth-screen__title">
              Войти
            </h1>
            <p class="auth-screen__text auth-screen__text--email">
              На указанную почту мы отправим код подтверждения
            </p>
          </div>

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
          <div class=" tw-grid tw-gap-4 tw-text-center tw-mb-[30px]">

            <h1 class="auth-screen__title">
              Введите код
            </h1>
            <p class="auth-screen__text auth-screen__text--code">
              На почту {{ displayEmail }} <br> мы отправили код
            </p>
          </div>

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

          <button class="auth-screen__resend " type="button">
            Не пришел код?
          </button>
        </template>

        <template v-else>
          <div class=" tw-grid tw-gap-4 tw-text-center tw-mb-6">

            <h1 class="auth-screen__title ">
              Придумайте пароль <br/> для быстрого входа
            </h1>
          </div>
          <div class=" tw-grid tw-gap-6">

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
                  <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.83398 14.0877L2.21923 15.7047C1.78048 16.1442 1.78048 16.8567 2.21998 17.2955C2.65948 17.7342 3.37198 17.7342 3.81073 17.2947L5.81023 15.2937C7.23373 16.031 8.95273 16.6482 10.89 16.8245V19.4997C10.89 20.1207 11.394 20.6247 12.015 20.6247C12.636 20.6247 13.14 20.1207 13.14 19.4997V16.8215C14.7502 16.6707 16.2082 16.217 17.4705 15.6432L19.8697 18.0447C20.3085 18.4842 21.021 18.4842 21.4605 18.0455C21.9 17.6067 21.9 16.8942 21.4612 16.4547L19.527 14.519C21.4695 13.2702 22.5952 11.9922 22.5952 11.9922C23.0047 11.5257 22.959 10.8147 22.4925 10.4045C22.026 9.99498 21.315 10.0407 20.9047 10.5072C20.9047 10.5072 17.2942 14.6247 12 14.6247C6.70573 14.6247 3.09523 10.5072 3.09523 10.5072C2.68498 10.0407 1.97398 9.99498 1.50748 10.4045C1.04098 10.8147 0.995227 11.5257 1.40473 11.9922C1.40473 11.9922 2.28598 12.9927 3.83398 14.0877Z" fill="#95939F"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.83398 14.0877L2.21923 15.7047C1.78048 16.1442 1.78048 16.8567 2.21998 17.2955C2.65948 17.7342 3.37198 17.7342 3.81073 17.2947L5.81023 15.2937C7.23373 16.031 8.95273 16.6482 10.89 16.8245V19.4997C10.89 20.1207 11.394 20.6247 12.015 20.6247C12.636 20.6247 13.14 20.1207 13.14 19.4997V16.8215C14.7502 16.6707 16.2082 16.217 17.4705 15.6432L19.8697 18.0447C20.3085 18.4842 21.021 18.4842 21.4605 18.0455C21.9 17.6067 21.9 16.8942 21.4612 16.4547L19.527 14.519C21.4695 13.2702 22.5952 11.9922 22.5952 11.9922C23.0047 11.5257 22.959 10.8147 22.4925 10.4045C22.026 9.99498 21.315 10.0407 20.9047 10.5072C20.9047 10.5072 17.2942 14.6247 12 14.6247C6.70573 14.6247 3.09523 10.5072 3.09523 10.5072C2.68498 10.0407 1.97398 9.99498 1.50748 10.4045C1.04098 10.8147 0.995227 11.5257 1.40473 11.9922C1.40473 11.9922 2.28598 12.9927 3.83398 14.0877Z" fill="red"/>
                  </svg>
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
                  <svg v-if="!isPasswordRepeatVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.83398 14.0877L2.21923 15.7047C1.78048 16.1442 1.78048 16.8567 2.21998 17.2955C2.65948 17.7342 3.37198 17.7342 3.81073 17.2947L5.81023 15.2937C7.23373 16.031 8.95273 16.6482 10.89 16.8245V19.4997C10.89 20.1207 11.394 20.6247 12.015 20.6247C12.636 20.6247 13.14 20.1207 13.14 19.4997V16.8215C14.7502 16.6707 16.2082 16.217 17.4705 15.6432L19.8697 18.0447C20.3085 18.4842 21.021 18.4842 21.4605 18.0455C21.9 17.6067 21.9 16.8942 21.4612 16.4547L19.527 14.519C21.4695 13.2702 22.5952 11.9922 22.5952 11.9922C23.0047 11.5257 22.959 10.8147 22.4925 10.4045C22.026 9.99498 21.315 10.0407 20.9047 10.5072C20.9047 10.5072 17.2942 14.6247 12 14.6247C6.70573 14.6247 3.09523 10.5072 3.09523 10.5072C2.68498 10.0407 1.97398 9.99498 1.50748 10.4045C1.04098 10.8147 0.995227 11.5257 1.40473 11.9922C1.40473 11.9922 2.28598 12.9927 3.83398 14.0877Z" fill="#95939F"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.83398 14.0877L2.21923 15.7047C1.78048 16.1442 1.78048 16.8567 2.21998 17.2955C2.65948 17.7342 3.37198 17.7342 3.81073 17.2947L5.81023 15.2937C7.23373 16.031 8.95273 16.6482 10.89 16.8245V19.4997C10.89 20.1207 11.394 20.6247 12.015 20.6247C12.636 20.6247 13.14 20.1207 13.14 19.4997V16.8215C14.7502 16.6707 16.2082 16.217 17.4705 15.6432L19.8697 18.0447C20.3085 18.4842 21.021 18.4842 21.4605 18.0455C21.9 17.6067 21.9 16.8942 21.4612 16.4547L19.527 14.519C21.4695 13.2702 22.5952 11.9922 22.5952 11.9922C23.0047 11.5257 22.959 10.8147 22.4925 10.4045C22.026 9.99498 21.315 10.0407 20.9047 10.5072C20.9047 10.5072 17.2942 14.6247 12 14.6247C6.70573 14.6247 3.09523 10.5072 3.09523 10.5072C2.68498 10.0407 1.97398 9.99498 1.50748 10.4045C1.04098 10.8147 0.995227 11.5257 1.40473 11.9922C1.40473 11.9922 2.28598 12.9927 3.83398 14.0877Z" fill="red"/>
                  </svg>
                </button>
              </template>
            </UiInput>
          </div>

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

  if (router.options.history.state.back) {
    router.back();
    return;
  }

  void router.push('/auth');
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
  z-index: 1;
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


.auth-screen__text {
  margin: 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
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
  margin-top: 40px;
}


.auth-screen__agreements {
  margin-top: 24px;
  display: grid;
  gap: 20px;
}

.auth-screen__resend {
  margin-top: 54px;
  margin-inline: auto;
  display: flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ui-text-muted);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: center;
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
