<template>
  <q-page class="profile-data-page">
    <main class="profile-data-screen" aria-label="Данные профиля">
      <header class="profile-data-header">
        <button class="profile-back" type="button" aria-label="Назад" @click="goBack">
          <span class="profile-back__icon" aria-hidden="true" />
        </button>
        <h1>Данные профиля</h1>
      </header>

      <section class="profile-data-card" aria-label="Верификация">
        <div class="profile-data-card__badge">
          <span aria-hidden="true" />
          Верифицирован
        </div>
        <p>{{ profileName }}</p>
      </section>

      <section class="profile-data-field">
        <h2>Номер телефона</h2>
        <div class="profile-data-value">
          <span>{{ profilePhone }}</span>
          <span class="profile-data-check" aria-hidden="true" />
        </div>
      </section>

      <section class="profile-data-field">
        <h2>Почта</h2>
        <div class="profile-data-value">
          <span>{{ profileEmail }}</span>
          <span class="profile-data-check" aria-hidden="true" />
        </div>
      </section>

      <button class="profile-data-logout" type="button" @click="logout">
        <span class="profile-data-logout__icon" aria-hidden="true" />
        Выйти из аккаунта
      </button>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth-store';

defineOptions({
  name: 'ProfileDataPage',
});

const router = useRouter();
const authStore = useAuthStore();

const profileName = computed(() => authStore.profileName || '—');
const profilePhone = computed(() => authStore.profilePhone || '—');
const profileEmail = computed(() => authStore.profileEmail || '—');

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/profile');
}

function logout() {
  authStore.logout();
  void router.push('/profile');
}
</script>

<style scoped lang="scss">
.profile-data-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.profile-data-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(16px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    24px
    calc(16px + var(--ui-safe-area-left));
  position: relative;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.profile-data-header {
  min-height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-data-header h1 {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.profile-back {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-surface-white);
  cursor: pointer;
}

.profile-back__icon {
  width: 9px;
  height: 9px;
  border-bottom: 2px solid var(--ui-text-muted);
  border-left: 2px solid var(--ui-text-muted);
  transform: rotate(45deg) translate(2px, -1px);
}

.profile-data-card {
  width: 100%;
  height: 99px;
  margin-top: 20px;
  padding: 16px 20px;
  border-radius: var(--ui-radius-sheet);
  background: var(--ui-surface-white);
}

.profile-data-card__badge {
  height: 32px;
  padding: 6px 12px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--ui-brand-light);
  color: var(--ui-text-brand);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
}

.profile-data-card__badge span,
.profile-data-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  display: block;
  background: var(--ui-brand-primary);
}

.profile-data-card__badge span::before,
.profile-data-check::before {
  content: "";
  width: 8px;
  height: 5px;
  border-left: 2px solid var(--ui-text-inverse);
  border-bottom: 2px solid var(--ui-text-inverse);
  position: absolute;
  left: 6px;
  top: 6px;
  transform: rotate(-45deg);
}

.profile-data-card p {
  margin: 14px 0 0;
  overflow: hidden;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-data-field {
  margin-top: 20px;
}

.profile-data-field h2 {
  margin: 0 0 10px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.profile-data-value {
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border: 1px solid #E8EBED;
  border-radius: var(--ui-radius-sheet);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 21px;
  align-items: center;
  background: var(--ui-surface-white);
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.profile-data-value span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-data-check {
  width: 21px;
  height: 21px;
}

.profile-data-logout {
  padding: 0;
  border: 0;
  position: absolute;
  left: 50%;
  bottom: 28px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #C9C9D1;
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  transform: translateX(-50%);
}

.profile-data-logout__icon {
  width: 18px;
  height: 18px;
  border-left: 5px solid currentColor;
  border-radius: 2px;
  position: relative;
  display: block;
}

.profile-data-logout__icon::before {
  content: "";
  width: 8px;
  height: 8px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  position: absolute;
  right: 1px;
  top: 5px;
  transform: rotate(45deg);
}
</style>
