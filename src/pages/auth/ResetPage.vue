<template>
  <main class="auth-page" aria-label="Сброс пароля">
    <section class="auth-screen">
      <button
        class="auth-screen__back"
        type="button"
        aria-label="Назад"
        @click="goBack"
      >
        <UiIcon name="back" size="24" color="var(--ui-text-icon)"/>
      </button>

      <form v-if="!recovery" class="auth-screen__form" @submit.prevent="submit">
        <template v-if="step === 'email'">
          <div class=" tw-text-center tw-mb-[30px]">

            <h1 class="auth-screen__title">
              Сброс пароля
            </h1>
            <p class="auth-screen__text auth-screen__text--email">
              На указанную почту мы отправим код для сброса пароля
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
            :disabled="busy"
          />

          <UiButton
            class="auth-screen__button auth-screen__button--email"
            size="large"
            type="submit"
            :disabled="!canSubmitEmail || busy || sendCooldown > 0"
          >
            {{ busy ? 'Отправка...' : sendCooldown ? `Повторить через ${sendCooldown} с` : 'Продолжить' }}
          </UiButton>

        </template>

        <template v-else-if="step === 'code'">
          <div class=" tw-mb-[30px]">

            <h1 class="auth-screen__title">
              Введите код
            </h1>
            <p class="auth-screen__text auth-screen__text--code">
              На почту {{ displayEmail }} <br/> мы отправили код для сброса пароля
            </p>
          </div>

          <UiInput
            v-model="code"
            class="auth-screen__input auth-screen__input--code"
            name="auth-code"
            inputmode="numeric"
            autocomplete="one-time-code"
            placeholder="Введите код"
            :disabled="busy"
          />

          <UiButton
            class="auth-screen__button auth-screen__button--code"
            size="large"
            type="submit"
            :disabled="!canSubmitCode || busy || checkCooldown > 0"
          >
            {{ busy ? 'Проверка...' : checkCooldown ? `Повторить через ${checkCooldown} с` : 'Продолжить' }}
          </UiButton>

          <button class="auth-screen__resend" type="button" :disabled="busy || sendCooldown > 0" @click="resendCode">
            {{ sendCooldown ? `Повторить отправку через ${sendCooldown} с` : 'Не пришёл код? Отправить повторно' }}
          </button>
        </template>

        <template v-else>
          <div class=" tw-mb-[30px]">

            <h1 class="auth-screen__title auth-screen__title--password">
              Придумайте новый пароль
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
              :disabled="busy"
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
              :disabled="busy"
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
            :disabled="!canSubmitPassword || busy"
          >
            {{ busy ? 'Сохранение...' : 'Сохранить пароль' }}
          </UiButton>
        </template>
        <p v-if="errorMessage" class="auth-screen__error" role="alert">{{ errorMessage }}</p>
      </form>
      <section v-else class="auth-screen__form" aria-label="Загрузка профиля">
        <h1 class="auth-screen__title">Пароль сохранён</h1>
        <p class="auth-screen__text" role="status">Повторите загрузку профиля для входа.</p>
        <p v-if="errorMessage" class="auth-screen__error" role="alert">{{ errorMessage }}</p>
        <UiButton class="auth-screen__button auth-screen__button--email" type="button" :disabled="busy" @click="retryProfile">{{ busy ? 'Загрузка...' : 'Повторить' }}</UiButton>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import UiInput from 'components/ui/UiInput.vue';
import { ApiError } from '@/api/errors';
import { useAuthStore } from 'stores/auth-store';

type AuthStep = 'email' | 'code' | 'password';
defineOptions({ name: 'ResetPage' });
const router = useRouter();
const authStore = useAuthStore();
const step = ref<AuthStep>('email');
const email = ref('');
const code = ref('');
const password = ref('');
const passwordRepeat = ref('');
const isPasswordVisible = ref(false);
const isPasswordRepeatVisible = ref(false);
const busy = ref(false);
const errorMessage = ref('');
const recovery = ref(Boolean(authStore.token && authStore.status !== 'authenticated'));
const sendCooldown = ref(0);
const checkCooldown = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | undefined;
let mounted = true;
let revision = 0;
const displayEmail = computed(() => authStore.resetEmail || email.value.trim());
const canSubmitEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
const canSubmitCode = computed(() => Boolean(code.value.trim()) && authStore.resetCodeSent);
const canSubmitPassword = computed(() => password.value.length >= 6 && password.value === passwordRepeat.value && Boolean(authStore.resetVerificationToken));
function clearSecrets() { code.value = ''; password.value = ''; passwordRepeat.value = ''; }
function invalidate() { revision++; clearSecrets(); errorMessage.value = ''; authStore.resetPasswordFlow(); }
function setCooldown(action: 'send' | 'check', seconds: number) {
  const target = action === 'send' ? sendCooldown : checkCooldown;
  target.value = Math.max(target.value, seconds);
  if (cooldownTimer) return;
  cooldownTimer = setInterval(() => {
    sendCooldown.value = Math.max(0, sendCooldown.value - 1);
    checkCooldown.value = Math.max(0, checkCooldown.value - 1);
    if (!sendCooldown.value && !checkCooldown.value && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = undefined;
    }
  }, 1000);
}
function setError(cause: unknown, action?: 'send' | 'check') {
  if (cause instanceof Error && cause.name === 'AbortError') return;
  errorMessage.value = cause instanceof ApiError ? cause.message : 'Не удалось выполнить запрос. Повторите попытку.';
  if (action && cause instanceof ApiError && cause.status === 429 && cause.retryAfter) {
    const seconds = Number(cause.retryAfter);
    const remaining = Number.isFinite(seconds) ? seconds : (Date.parse(cause.retryAfter) - Date.now()) / 1000;
    if (Number.isFinite(remaining) && remaining > 0) setCooldown(action, Math.ceil(remaining));
  }
}
watch(email, () => { if (step.value === 'email') invalidate(); });
watch(() => authStore.token, (next, previous) => {
  if (!next && previous) {
    recovery.value = false;
    invalidate(); step.value = 'email'; busy.value = false;
    errorMessage.value = 'Сессия завершилась. Начните восстановление заново.';
  }
}, { flush: 'sync' });
function goBack() {
  if (busy.value) return;
  if (recovery.value) { void router.push('/'); return; }
  if (step.value !== 'email') { invalidate(); step.value = 'email'; return; }
  invalidate();
  if (router.options.history.state.back) router.back(); else void router.push('/auth');
}
async function submit() {
  if (busy.value) return;
  if (step.value === 'email' && (!canSubmitEmail.value || sendCooldown.value)) return;
  if (step.value === 'code' && (!canSubmitCode.value || checkCooldown.value)) return;
  if (step.value === 'password' && !canSubmitPassword.value) return;
  const action = step.value === 'email' ? 'send' : step.value === 'code' ? 'check' : undefined;
  const current = ++revision;
  busy.value = true;
  errorMessage.value = '';
  try {
    if (step.value === 'email') {
      const normalized = email.value.trim().toLowerCase();
      await authStore.sendResetCode(normalized);
      if (!mounted || current !== revision) return;
      step.value = 'code';
    } else if (step.value === 'code') {
      await authStore.checkResetCode(code.value.trim());
      if (!mounted || current !== revision) return;
      code.value = '';
      step.value = 'password';
    } else {
      await authStore.setResetPassword(password.value);
      if (!mounted || current !== revision) return;
      clearSecrets();
      if (authStore.isAuthenticated) await router.replace('/');
      else { recovery.value = Boolean(authStore.token); errorMessage.value = 'Не удалось загрузить профиль.'; }
    }
  } catch (cause) {
    if (!mounted || current !== revision) return;
    if (authStore.token && authStore.status !== 'authenticated') {
      recovery.value = true; clearSecrets(); setError(cause);
    } else if (step.value === 'password' && !authStore.resetVerificationToken) {
      invalidate(); step.value = 'email';
      errorMessage.value = 'Подтверждение истекло. Запросите новый код.';
    } else setError(cause, action);
  } finally { if (mounted && current === revision) busy.value = false; }
}
async function resendCode() {
  if (busy.value || sendCooldown.value || step.value !== 'code') return;
  const current = ++revision;
  busy.value = true;
  errorMessage.value = '';
  clearSecrets();
  try { await authStore.sendResetCode(email.value); }
  catch (cause) {
    if (mounted && current === revision) {
      if (!authStore.resetCodeSent) step.value = 'email';
      setError(cause, 'send');
    }
  }
  finally { if (mounted && current === revision) busy.value = false; }
}
async function retryProfile() {
  if (busy.value) return;
  if (!authStore.token) { recovery.value = false; step.value = 'email'; errorMessage.value = 'Сессия завершилась. Начните восстановление заново.'; return; }
  const current = ++revision;
  busy.value = true; errorMessage.value = '';
  try {
    await authStore.fetchProfile();
    if (mounted && current === revision && authStore.isAuthenticated) await router.replace('/');
  } catch (cause) { if (mounted && current === revision) setError(cause); }
  finally { if (mounted && current === revision) busy.value = false; }
}
onBeforeUnmount(() => {
  mounted = false; revision++; clearSecrets(); authStore.resetPasswordFlow();
  if (cooldownTimer) clearInterval(cooldownTimer);
});
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

.auth-screen__error {
  margin: 20px 0 0;
  color: var(--q-negative);
  white-space: pre-line;
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

.auth-screen__resend:disabled { cursor: default; opacity: .65; }

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
