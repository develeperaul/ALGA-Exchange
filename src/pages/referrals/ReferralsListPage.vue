<template>
  <q-page class="referrals-list-page">
    <main class="referrals-list" aria-label="Мои рефералы">
      <header class="referrals-list__header">
        <button class="referrals-list__back" type="button" aria-label="Назад" @click="router.back()">
          <q-icon name="chevron_left" size="24px" />
        </button>

        <h1 class="referrals-list__title">
          Мои рефералы
        </h1>

        <button
          v-if="hasReferrals"
          class="referrals-list__filter"
          type="button"
          aria-label="Фильтр"
        >
          <span />
        </button>
      </header>

      <template v-if="hasReferrals">
        <section class="referrals-list__stats" aria-label="Статистика">
          <div>
            <strong>{{ referrals.length }}</strong>
            <span>Всего рефералов</span>
          </div>
          <img :src="myReferralsImage" alt="" aria-hidden="true">
        </section>

        <section class="referrals-list__cards" aria-label="Список рефералов">
          <article v-for="referral in referrals" :key="referral.id" class="referral-card">
            <div class="referral-card__top">
              <span class="referral-card__avatar" aria-hidden="true">
                <q-icon name="person_add" size="18px" />
              </span>
              <span class="referral-card__id">ID {{ referral.id }}</span>
              <time class="referral-card__date">{{ referral.date }}</time>
            </div>

            <dl class="referral-card__metrics">
              <div>
                <dt>{{ referral.amount }} USDT</dt>
                <dd>Сумма сделок</dd>
              </div>
              <div>
                <dt>{{ referral.deals }}</dt>
                <dd>Количество сделок</dd>
              </div>
            </dl>
          </article>
        </section>
      </template>

      <section v-else class="referrals-empty" aria-label="Нет рефералов">
        <img class="referrals-empty__image" :src="myReferralsImage" alt="" aria-hidden="true">
        <p class="referrals-empty__text">
          У вас пока нет приглашенных друзей
        </p>
        <UiButton class="referrals-empty__button" size="large" @click="copyInviteLink">
          Пригласить
          <q-icon name="link" size="20px" />
        </UiButton>
      </section>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import myReferralsImage from 'assets/referrals/my-referrals.png';

defineOptions({
  name: 'ReferralsListPage',
});

interface ReferralItem {
  id: string;
  date: string;
  amount: string;
  deals: number;
}

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const inviteLink = 'ds.com/DS_Exchange123456';

const filledReferrals: ReferralItem[] = [
  { id: '851066', date: '31 янв 2026', amount: '2500', deals: 132 },
  { id: '247710', date: '29 дек 2025', amount: '148', deals: 3 },
];

const referrals = computed(() => (route.query.empty === '1' ? [] : filledReferrals));
const hasReferrals = computed(() => referrals.value.length > 0);

async function copyInviteLink() {
  await navigator.clipboard.writeText(inviteLink);
  $q.notify({ message: 'Ссылка скопирована', color: 'positive', timeout: 1200 });
}
</script>

<style scoped lang="scss">
.referrals-list-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.referrals-list {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(20px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.referrals-list__header {
  height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.referrals-list__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.referrals-list__back,
.referrals-list__filter {
  width: 32px;
  height: 32px;
  border: 0;
  position: absolute;
  top: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.referrals-list__back {
  left: 0;
  border-radius: 50%;
  background: var(--ui-surface-white);
}

.referrals-list__filter {
  right: -4px;
  color: var(--ui-brand-primary);
}

.referrals-list__filter span,
.referrals-list__filter::before,
.referrals-list__filter::after {
  height: 2px;
  border-radius: 2px;
  display: block;
  background: currentColor;
}

.referrals-list__filter span {
  width: 13px;
}

.referrals-list__filter::before,
.referrals-list__filter::after {
  content: '';
  position: absolute;
  left: 10px;
}

.referrals-list__filter::before {
  top: 10px;
  width: 13px;
}

.referrals-list__filter::after {
  top: 20px;
  width: 5px;
}

.referrals-list__stats {
  height: 70px;
  margin-top: 43px;
  padding: 11px 16px;
  border-radius: 16px;
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  background: var(--ui-surface-white);
}

.referrals-list__stats strong,
.referrals-list__stats span {
  display: block;
}

.referrals-list__stats strong {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.referrals-list__stats span {
  margin-top: 7px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.referrals-list__stats img {
  width: 83px;
  height: 83px;
  position: absolute;
  top: -15px;
  right: 22px;
  object-fit: contain;
}

.referrals-list__cards {
  margin-top: 26px;
  display: grid;
  gap: 12px;
}

.referral-card {
  min-height: 115px;
  padding: 16px;
  border-radius: 16px;
  background: var(--ui-surface-white);
}

.referral-card__top {
  display: flex;
  align-items: center;
}

.referral-card__avatar {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  color: var(--ui-brand-primary);
}

.referral-card__id {
  margin-left: 10px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.referral-card__date {
  margin-left: auto;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t3);
  line-height: var(--ui-line-t3);
  font-style: normal;
}

.referral-card__metrics {
  margin: 21px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
}

.referral-card__metrics div,
.referral-card__metrics dt,
.referral-card__metrics dd {
  min-width: 0;
  margin: 0;
}

.referral-card__metrics dt {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.referral-card__metrics dd {
  margin-top: 5px;
  color: var(--ui-text-muted);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.referrals-empty {
  padding-top: 59px;
  display: grid;
  justify-items: center;
}

.referrals-empty__image {
  width: 221px;
  height: 148px;
  object-fit: contain;
}

.referrals-empty__text {
  width: 215px;
  margin: 21px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
  text-align: center;
}

.referrals-empty__button {
  width: 250px;
  margin-top: 33px;
}

.referrals-empty__button :deep(.ui-button__content) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
