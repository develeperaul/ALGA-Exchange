<template>
  <q-page class="profile-faq-page">
    <main class="profile-faq-screen" aria-label="Часто задаваемые вопросы">
      <PageHeader title="Часто задаваемые вопросы" />

      <section class="profile-faq-list">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="profile-faq-item"
        >
          <button
            class="profile-faq-question"
            :class="{
              'profile-faq-question--active': openIndex === index,
              'profile-faq-question--large': item.isLarge,
            }"
            type="button"
            @click="toggle(index)"
          >
            {{ item.question }}
            <span
              class="profile-faq-chevron"
              :class="{ 'profile-faq-chevron--up': openIndex === index }"
              aria-hidden="true"
            />
          </button>

          <div
            v-if="openIndex === index"
            class="profile-faq-answer"
          >
            {{ item.answer }}
          </div>
        </div>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageHeader from 'components/PageHeader.vue';

interface FaqItem {
  question: string;
  answer: string;
  isLarge?: boolean;
}

const faqItems: FaqItem[] = [
  {
    question: 'Какие документы нужны для KYC?',
    answer: 'Для KYC необходим только паспорт - главная страница с фото и разворот с регистрацией.',
  },
  {
    question: 'Как купить USDT?',
    answer: 'Выберите раздел "Обмен" на главной странице, укажите сумму и следуйте инструкциям.',
  },
  {
    question: 'В каких городах доступен наличный обмен?',
    answer: 'Наличный обмен доступен в крупных городах России. Уточните актуальный список при оформлении заявки.',
    isLarge: true,
  },
];

const openIndex = ref<number | null>(null);

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index;
}

defineOptions({
  name: 'ProfileFaqPage',
});
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

.profile-faq-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-faq-item {
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
