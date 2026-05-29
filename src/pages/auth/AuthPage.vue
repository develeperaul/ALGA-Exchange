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
        <h1 class="auth-screen__title">
          Авторизация
        </h1>

        <UiInput
          v-model="email"
          class="auth-screen__input auth-screen__input--email"
          name="login-email"
          label="Введите почту"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="Email"
          :disabled="authStore.isLoading"
        />

        <UiInput
          v-model="password"
          class="auth-screen__input auth-screen__input--password"
          name="login-password"
          label="Введите пароль"
          :type="isPasswordVisible ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Password"
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

        <UiButton
          class="auth-screen__button"
          size="large"
          type="submit"
          :disabled="!canSubmit || authStore.isLoading"
        >
          {{ authStore.isLoading ? 'Вход...' : 'Войти' }}
        </UiButton>

        <button
          class="auth-screen__forgot"
          type="button"
          @click="goResetPassword"
        >
          Не помню пароль
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import UiInput from 'components/ui/UiInput.vue';
import { useAuthStore } from 'stores/auth-store';

defineOptions({
  name: 'AuthPage',
});

const router = useRouter();
const authStore = useAuthStore();

const email = ref(authStore.email);
const password = ref('');
const isPasswordVisible = ref(false);
const canSubmit = computed(() => Boolean(email.value.trim()) && Boolean(password.value));

function goBack () {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/');
}

function goResetPassword () {
  void router.push('/reset-password');
}

async function submit () {
  if (!canSubmit.value) {
    return;
  }

  try {
    const normalizedEmail = email.value.trim();

    await authStore.login(normalizedEmail, password.value);
    email.value = normalizedEmail;
    void router.push('/');
  } catch {
    return;
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

.auth-screen__input {
  width: 100%;
}

.auth-screen__input :deep(.ui-input__control) {
  height: 50px;
}

.auth-screen__input--email {
  margin-top: 54px;
}

.auth-screen__input--password {
  margin-top: 18px;
}

.auth-screen__button {
  width: 100%;
  margin-top: 24px;
}

.auth-screen__forgot {
  margin-top: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ui-brand-primary);
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 500;
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

.auth-screen__visibility-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  transform: translate(-50%, -50%);
}
</style>
