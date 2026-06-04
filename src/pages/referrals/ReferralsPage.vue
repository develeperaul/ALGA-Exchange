<template>
  <q-page class="referrals-page">
    <main class="referrals-screen" aria-label="Рефералы">
      <div v-if="variant === 'guest'">
        <section class="referrals-hero" aria-label="Реферальная программа">
          <img class="referrals-hero__image" :src="guestHeroImage" alt="" aria-hidden="true">

          <h1 class="referrals-hero__title">
            Делитесь ссылкой с друзьями
            <br>
            и получайте доход от их сделок
          </h1>
        </section>

        <p class="referrals-hero__subtitle">
          Войдите, чтобы начать пользоваться реферальной программой и получать бонусы
        </p>

        <UiButton class="referrals-hero__button" size="large" @click="goAuth">
          Войти
        </UiButton>

        <h2 class="referrals-how-title">
          Как это работает?
        </h2>

        <UiStageField class="referrals-stage" />
      </div>

      <div v-else>
        <section class="referrals-auth-hero" aria-label="Реферальная программа">
          <img class="referrals-auth-hero__image" :src="authHeroImage" alt="" aria-hidden="true">

          <h1 class="referrals-auth-hero__title">
            Делитесь ссылкой с друзьями
            <br>
            и получайте доход от их сделок
          </h1>
        </section>

        <ReferralLinkField class="referrals-auth-link" :value="referralLink" />

        <UiButton class="referrals-auth-share" size="large">
          Поделиться
          <UiIcon name="link" size="24" color="var(--ui-surface-white)"/>
        </UiButton>

        <ReferralBalanceCard class="referrals-auth-balance" amount="1300" currency="USDT" />

        <ReferralIncomeCard class="referrals-auth-income" value="+832 USDT" />

        <h2 class="referrals-how-title referrals-how-title--auth">
          Как это работает?
        </h2>

        <UiStageField class="referrals-stage" />

        <div class="referrals-auth-promos" aria-label="Промо блоки">
          <RouterLink class="referrals-auth-promo-link" to="/referrals/my">
            <ReferralPromoCard title="Мои рефералы" :image="myReferralsImage" />
          </RouterLink>

          <button class="referrals-auth-promo-button" type="button" @click="showInfluencerSheet = true">
            <ReferralPromoCard variant="influencer" title="Специальные условия для инфлюенсеров">
              <template #image>
                <div class="referrals-auth-influencer" aria-hidden="true">
                  <img class="referrals-auth-influencer__img referrals-auth-influencer__img--1" :src="influencer1Image" alt="">
                  <img class="referrals-auth-influencer__img referrals-auth-influencer__img--2" :src="influencer2Image" alt="">
                </div>
              </template>
            </ReferralPromoCard>
          </button>
        </div>
      </div>
    </main>

    <InfluencerConditionsModal v-model="showInfluencerSheet" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UiButton from 'components/ui/UiButton.vue';
import { RouterLink, useRouter } from 'vue-router';
import UiStageField from 'components/ui/UiStageField.vue';
import ReferralBalanceCard from 'components/referrals/ReferralBalanceCard.vue';
import ReferralIncomeCard from 'components/referrals/ReferralIncomeCard.vue';
import ReferralLinkField from 'components/referrals/ReferralLinkField.vue';
import ReferralPromoCard from 'components/referrals/ReferralPromoCard.vue';
import InfluencerConditionsModal from 'components/modals/InfluencerConditionsModal.vue';
import guestHeroImage from 'assets/referrals-hero.png';
import authHeroImage from 'assets/referrals/hero.png';
import influencer1Image from 'assets/referrals/influencer-1.png';
import influencer2Image from 'assets/referrals/influencer-2.png';
import myReferralsImage from 'assets/referrals/my-referrals.png';
import { useAuthStore } from 'stores/auth-store';
import UiIcon from 'src/components/ui/UiIcon.vue';

defineOptions({
  name: 'ReferralsPage',
});

type ReferralsVariant = 'guest' | 'authorized';
const router = useRouter();
const authStore = useAuthStore();
const variant = computed<ReferralsVariant>(() => (authStore.isAuthenticated ? 'authorized' : 'guest'));
const referralLink = 'ds.com/DS_Exchange123456';
const showInfluencerSheet = ref(false);

function goAuth() {
   router.push('/auth');
}
</script>

<style scoped lang="scss">
.referrals-page {
  width: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.referrals-screen {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(24px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(24px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.referrals-hero {
  display: grid;
  justify-items: center;
  text-align: center;
}

.referrals-hero__image {
  width: 155px;
  height: 155px;
  display: block;
  object-fit: contain;
}

.referrals-hero__title {
  width: 100%;
  max-width: 343px;
  margin: 16px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.referrals-hero__subtitle {
  width: 100%;
  max-width: 343px;
  margin: 20px auto 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.referrals-hero__button {
  margin-top: 24px;
}

.referrals-how-title {
  margin: 40px 0 0;
  text-align: center;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.referrals-stage {
  margin-top: 16px;
}

.referrals-auth-hero {
  display: grid;
  justify-items: center;
  text-align: center;
}

.referrals-auth-hero__image {
  width: 155px;
  height: 155px;
  display: block;
  object-fit: contain;
}

.referrals-auth-hero__title {
  width: 100%;
  max-width: 343px;
  margin: 16px 0 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: 0;
}

.referrals-auth-link {
  margin-top: 20px;
}

.referrals-auth-share {
  margin-top: 20px;
}

.referrals-auth-balance {
  margin-top: 40px;
}

.referrals-auth-income {
  margin-top: 40px;
}

.referrals-how-title--auth {
  margin-top: 40px;
}

.referrals-auth-promos {
  margin-top: 37px;
  display: grid;
  row-gap: 24px;
}

.referrals-auth-promo-link {
  display: block;
  color: inherit;
}

.referrals-auth-promo-button {
  width: 100%;
  padding: 0;
  border: 0;
  display: block;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.referrals-auth-influencer {
  width: 102px;
  height: 83px;
  position: relative;
}

.referrals-auth-influencer__img {
  position: absolute;
  object-fit: contain;
}

.referrals-auth-influencer__img--1 {
  width: 102px;
  height: 102px;
  left: 0;
  top: -15px;
}

.referrals-auth-influencer__img--2 {
  width: 106px;
  height: 106px;
  left: -13px;
  top: -11px;
}

</style>
