<template>
  <q-page class="profile-faq-page">
    <main class="profile-faq-screen" aria-label="Часто задаваемые вопросы">
      <header class="profile-faq-header">
        <button class="profile-back" type="button" aria-label="Назад" @click="goBack">
          <span class="profile-back__icon" aria-hidden="true" />
        </button>
        <h1>Часто задаваемые вопросы</h1>
      </header>

      <section class="profile-faq-list">
        <button class="profile-faq-question profile-faq-question--active" type="button">
          Какие документы нужны для KYC?
          <span class="profile-faq-chevron profile-faq-chevron--up" aria-hidden="true" />
        </button>

        <div class="profile-faq-answer">
          Для KYC необходим только паспорт - главная страница с фото и разворот с регистрацией.
        </div>

        <button class="profile-faq-question" type="button">
          Как купить USDT?
          <span class="profile-faq-chevron" aria-hidden="true" />
        </button>

        <button class="profile-faq-question profile-faq-question--large" type="button">
          В каких городах доступен наличный обмен?
          <span class="profile-faq-chevron" aria-hidden="true" />
        </button>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProfileFaqPage',
});

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  void router.push('/profile');
}
</script>

<style scoped lang="scss">
.profile-faq-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.profile-faq-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(16px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    24px
    calc(16px + var(--ui-safe-area-left));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.profile-faq-header {
  min-height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-faq-header h1 {
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

.profile-faq-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-faq-question,
.profile-faq-answer {
  width: 100%;
  border-radius: var(--ui-radius-sheet);
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.profile-faq-question {
  min-height: 50px;
  padding: 10px 20px;
  border: 1px solid transparent;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  text-align: left;
  cursor: pointer;
}

.profile-faq-question--active {
  border-color: var(--ui-brand-light);
}

.profile-faq-question--large {
  min-height: 60px;
}

.profile-faq-answer {
  min-height: 86px;
  padding: 16px 20px;
  border: 1px solid var(--ui-brand-light);
  color: var(--ui-text-secondary);
}

.profile-faq-chevron {
  width: 9px;
  height: 9px;
  justify-self: end;
  border-right: 1.5px solid var(--ui-text-muted);
  border-bottom: 1.5px solid var(--ui-text-muted);
  transform: rotate(45deg) translate(-2px, -2px);
}

.profile-faq-chevron--up {
  transform: rotate(-135deg) translate(-2px, -2px);
}
</style>
