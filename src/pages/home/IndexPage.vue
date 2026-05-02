<template>
  <q-page class="home-page">
    <main class="home-screen" aria-label="ALGA Exchange home">
      <HomeExchangeHero />
      <HomeAuthBanner class="home-screen__auth-banner" />
      <HomeActionCard class="home-screen__action-card" />
      <HomeRateTable class="home-screen__rate-table" :items="rateItems" />
      <HomeActionsCard class="home-screen__image-card" />
      <HomeLimitCard class="home-screen__image-card" />
      <HomeReferralCard class="home-screen__referral-card" />
    </main>
  </q-page>
</template>

<script setup lang="ts">
import HomeActionCard from 'components/home/HomeActionCard.vue';
import HomeActionsCard from 'components/home/HomeActionsCard.vue';
import HomeAuthBanner from 'components/home/HomeAuthBanner.vue';
import HomeExchangeHero from 'components/home/HomeExchangeHero.vue';
import HomeLimitCard from 'components/home/HomeLimitCard.vue';
import HomeRateTable from 'components/home/HomeRateTable.vue';
import HomeReferralCard from 'components/home/HomeReferralCard.vue';

defineOptions({
  name: 'IndexPage',
});

const rateItems = [
  {
    name: 'Безналичный',
    buy: {
      direction: 'up',
      value: '79,8 ₽',
    },
    sell: {
      direction: 'up',
      value: '76,33 ₽',
    },
  },
  {
    name: 'Наличный',
    buy: {
      direction: 'down',
      value: '79,9 ₽',
    },
    sell: {
      direction: 'up',
      value: '77,33 ₽',
    },
  },
] as const;
</script>

<style scoped lang="scss">
.home-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.home-screen {
  width: 100%;
  min-height: 100vh;
  padding:
    calc(100px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(16px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  overflow-x: hidden;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.home-screen__action-card {
  margin-top: 10px;
}

.home-screen__auth-banner {
  margin-top: 10px;
}

.home-screen__rate-table {
  margin-top: 24px;
}

.home-screen__image-card {
  margin-top: 16px;
}

.home-screen__referral-card {
  margin-top: 16px;
}
</style>
