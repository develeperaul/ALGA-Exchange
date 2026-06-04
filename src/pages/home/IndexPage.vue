<template>
  <q-page class="home-page">
    <main class="home-screen" aria-label="ALGA Exchange home">
      <HomeGreetingHeader
        v-if="homeState === 'hasKyc'"
        class="home-screen__greeting"
        :name="greetingName"
      />
      <HomeExchangeHero />
      <div class="home-screen__actions">
        <HomeActionCard class="home-screen__action-card"
          text="Наличный обмен"
          icon="money"
          to="/exchange/cash" />
        <HomeActionCard
          class="home-screen__action-card"
          text="Оплата инвойса"
          icon="invoice"
          to="/invoice"
        />
      </div>
      <HomeRateTable class="home-screen__rate-table" :items="rateItems" />
      <HomeKycPromoCard v-if="homeState === 'hasPhoneNoKyc'" class="home-screen__image-card" />
      <HomeLimitsPromoCard v-if="homeState === 'hasKyc'" class="home-screen__image-card" />
      <HomeReferralCard class="home-screen__referral-card" />
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import HomeActionCard from 'components/home/HomeActionCard.vue';
import HomeExchangeHero from 'components/home/HomeExchangeHero.vue';
import HomeGreetingHeader from 'components/home/HomeGreetingHeader.vue';
import HomeKycPromoCard from 'components/home/HomeKycPromoCard.vue';
import HomeLimitsPromoCard from 'components/home/HomeLimitsPromoCard.vue';
import HomeRateTable from 'components/home/HomeRateTable.vue';
import HomeReferralCard from 'components/home/HomeReferralCard.vue';
import { useAuthStore } from 'stores/auth-store';

defineOptions({
  name: 'IndexPage',
});

const authStore = useAuthStore();

type HomeState = 'guest' | 'hasPhoneNoKyc' | 'hasKyc';

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

const homeState = computed<HomeState>(() => {
  if (authStore.hasKyc) {
    return 'hasKyc';
  }

  if (authStore.isAuthenticated && authStore.hasPhone) {
    return 'hasPhoneNoKyc';
  }

  return 'guest';
});

const greetingName = computed(() => {
  if (authStore.profileName) {
    const parts = authStore.profileName.split(' ').filter(Boolean);

    if (parts.length >= 2) {
      return parts[1] || parts[0] || 'Пользователь';
    }

    return parts[0] || 'Пользователь';
  }

  const email = authStore.profileEmail || authStore.email;

  if (email.includes('@')) {
    return email.split('@')[0];
  }

  return 'Пользователь';
});
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
    calc(24px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(16px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  overflow-x: hidden;
  background: var(--ui-surface-page);
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.home-screen__greeting {
  margin-bottom: 16px;
}

.home-screen__actions {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.home-screen__rate-table {
  margin-top: 24px;
}

.home-screen__image-card,
.home-screen__referral-card {
  margin-top: 16px;
}
</style>
