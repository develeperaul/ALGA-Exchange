<template>
  <q-page class="profile-page">
    <main class="profile-screen" aria-label="Профиль">
      <template v-if="profileVariant === 'guest'">
        <section class="profile-auth-card" aria-label="Вход">
          <div class="profile-auth-card__title">
            <span class="profile-avatar profile-avatar--small" aria-hidden="true" />
            <h1>Войти/авторизоваться</h1>
          </div>

          <UiButton class="profile-auth-card__button" size="mini" @click="goAuth">
            Войти
          </UiButton>
        </section>

        <ProfileMenuRow
          class="profile-row profile-row--first"
          icon="portfel"
          label="Юридическая информация"
          :chevron="legalOpen ? 'up' : 'down'"
          bordered
          @click="legalOpen = !legalOpen"
        />

        <section v-if="legalOpen" class="profile-legal" aria-label="Юридическая информация">
          <a href="#" @click.prevent>Публичная оферта</a>
          <a href="#" @click.prevent>Политика конфиденциальности</a>
          <a href="#" @click.prevent>AML</a>
        </section>

        <ProfileMenuRow
          class="profile-row"
          icon="faq"
          label="Часто задаваемые вопросы"
          @click="goFaq"
        />
        <ProfileMenuRow class="profile-row" icon="support" label="Техподдержка" />
      </template>

      <template v-else>
        <header class="profile-user">
          <span class="profile-avatar" aria-hidden="true" />
          <p>{{ profileEmail }}</p>
        </header>

        <section class="profile-verify-card" aria-label="Верификация">
          <h1>
            <span class="profile-check" aria-hidden="true" />
            Пройдите верификацию
          </h1>
          <p>Для выгодных безналичных обменов</p>
          <UiButton class="profile-verify-card__button" size="mini" @click="goKyc">
            Верификация
          </UiButton>
        </section>

        <ProfileMenuRow
          class="profile-row profile-row--first"
          icon="legal"
          label="Юридическая информация"
          :chevron="legalOpen ? 'up' : 'down'"
          @click="legalOpen = !legalOpen"
        />
        <section v-if="legalOpen" class="profile-legal profile-legal--auth" aria-label="Юридическая информация">
          <a href="#" @click.prevent>Публичная оферта</a>
          <a href="#" @click.prevent>Политика конфиденциальности</a>
          <a href="#" @click.prevent>AML</a>
        </section>
        <ProfileMenuRow class="profile-row" icon="faq" label="Часто задаваемые вопросы" chevron="right" @click="goFaq" />
        <ProfileMenuRow class="profile-row" icon="support" label="Техподдержка" />
      </template>

      <footer class="profile-meta" :class="{ 'profile-meta--auth': profileVariant === 'authorized' }">
        <button v-if="profileVariant === 'authorized'" class="profile-logout" type="button" @click="logout">
          <span class="profile-logout__icon" aria-hidden="true" />
          Выйти из аккаунта
        </button>
        <p>Версия 1.0</p>
      </footer>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProfileMenuRow from 'components/profile/ProfileMenuRow.vue';
import UiButton from 'components/ui/UiButton.vue';
import { useAuthStore } from 'stores/auth-store';

type ProfileVariant = 'guest' | 'authorized';

defineOptions({
  name: 'ProfilePage',
});

const router = useRouter();
const authStore = useAuthStore();
const profileVariant = computed<ProfileVariant>(() => (authStore.isAuthenticated ? 'authorized' : 'guest'));
const profileEmail = computed(() => authStore.profileEmail || '—');
const legalOpen = ref(!authStore.isAuthenticated);

function goAuth() {
  void router.push('/auth');
}

function goFaq() {
  void router.push('/profile/faq');
}

function goKyc() {
  void router.push('/kyc');
}

function logout() {
  authStore.logout();
}
</script>

<style scoped lang="scss">
.profile-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.profile-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(30px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    24px
    calc(16px + var(--ui-safe-area-left));
  position: relative;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.profile-auth-card,
.profile-verify-card {
  width: 100%;
  min-height: 122px;
  padding: 16px 20px 26px;
  border-radius: var(--ui-radius-sheet);
  overflow: hidden;
  background: linear-gradient(101deg, #2E303D 7.43%, #535D76 107.43%);
  color: var(--ui-text-inverse);
}

.profile-auth-card__title,
.profile-verify-card h1 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-auth-card h1,
.profile-verify-card h1 {
  margin: 0;
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.profile-auth-card__button,
.profile-verify-card__button {
  width: 230px;
  margin-top: 20px;
}

.profile-verify-card {
  min-height: 144px;
  margin-top: 24px;
}

.profile-verify-card p {
  margin: 10px 0 0;
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  letter-spacing: -0.3px;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  display: block;
  flex: 0 0 auto;
  background: var(--ui-brand-primary);
}

.profile-avatar--small {
  width: 24px;
  height: 24px;
}

.profile-avatar::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 7px;
  background: var(--ui-text-inverse);
  transform: translateX(-50%);
}

.profile-avatar::after {
  content: "";
  width: 16px;
  height: 8px;
  border-radius: 9px 9px 4px 4px;
  position: absolute;
  left: 50%;
  bottom: 6px;
  background: var(--ui-text-inverse);
  transform: translateX(-50%);
}

.profile-avatar--small::before {
  width: 6px;
  height: 6px;
  top: 5px;
}

.profile-avatar--small::after {
  width: 12px;
  height: 6px;
  bottom: 5px;
}

.profile-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: relative;
  display: block;
  flex: 0 0 auto;
  background: var(--ui-brand-primary);
}

.profile-check::before {
  content: "";
  width: 9px;
  height: 6px;
  border-left: 2px solid var(--ui-text-inverse);
  border-bottom: 2px solid var(--ui-text-inverse);
  position: absolute;
  left: 7px;
  top: 8px;
  transform: rotate(-45deg);
}

.profile-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-user p {
  margin: 0;
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.profile-row {
  margin-top: 16px;
}

.profile-row--first {
  margin-top: 30px;
}

.profile-verified-button {
  width: 100%;
  padding: 0;
  border: 0;
  display: block;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.profile-legal {
  width: 100%;
  min-height: 131px;
  margin-top: 10px;
  padding: 17px 20px;
  border: 1px solid var(--ui-brand-light);
  border-radius: var(--ui-radius-sheet);
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--ui-surface-white);
}

.profile-legal--auth {
  min-height: auto;
}

.profile-legal a {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  letter-spacing: -0.3px;
}

.profile-meta {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 20px;
  color: var(--ui-text-muted);
  text-align: center;
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
}

.profile-meta--auth {
  bottom: 18px;
}

.profile-meta p {
  margin: 0;
}

.profile-logout {
  margin: 0 0 14px;
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #C9C9D1;
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
}

.profile-logout__icon {
  width: 18px;
  height: 18px;
  border-left: 5px solid currentColor;
  border-radius: 2px;
  position: relative;
  display: block;
}

.profile-logout__icon::before {
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
