<template>
  <q-page class="home-page">
    <main class="home-screen" aria-label="ALGA Exchange home">
      <KycStatusCard
        v-if="kycCardStatus"
        class="home-screen__kyc-status"
        :status="kycCardStatus"
        @click="showKycModal = true"
      />

      <HomeGreetingHeader
        v-if="homeState === 'hasKyc'"
        class="home-screen__greeting"
        :name="greetingName"
      />
      <HomeExchangeHero />

      <div class="home-screen__actions">
        <HomeActionCard
          class="home-screen__action-card"
          text="Наличный обмен"
          icon="money"
          to="/exchange/cash"
        />
        <HomeActionCard
          class="home-screen__action-card"
          text="Оплата инвойса"
          icon="invoice"
          to="/invoice"
        />
      </div>
      <HomeRateTable class="home-screen__rate-table" :items="isMockMode ? demoRateItems : rateItems"
        @refresh="refreshRates" />
      <HomeKycPromoCard
        v-show="authStore.verificationStatus === 'unverified'"
        class="home-screen__image-card"
      />
      <HomeLimitsPromoCard
        v-show="authStore.verificationStatus === 'approved' && !authStore.kycBlocked"
        class="home-screen__image-card"
      />
      <HomeReferralCard class="home-screen__referral-card" />
    </main>
    <KycStatusModal
      v-if="kycCardStatus"
      v-model="showKycModal"
      :status="kycCardStatus"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { isMockMode } from 'src/api/config';
import type { SharedQuote, CashRate } from 'src/api/quotes';
import { useHomeQuotes } from 'src/composables/useHomeQuotes';
import HomeActionCard from 'components/home/HomeActionCard.vue';
import HomeExchangeHero from 'components/home/HomeExchangeHero.vue';
import HomeGreetingHeader from 'components/home/HomeGreetingHeader.vue';
import HomeKycPromoCard from 'components/home/HomeKycPromoCard.vue';
import HomeLimitsPromoCard from 'components/home/HomeLimitsPromoCard.vue';
import HomeRateTable from 'components/home/HomeRateTable.vue';
import HomeReferralCard from 'components/home/HomeReferralCard.vue';
import KycStatusCard, { type KycCardStatus } from 'components/kyc/KycStatusCard.vue';
import KycStatusModal from 'components/kyc/KycStatusModal.vue';
import { useAuthStore } from 'stores/auth-store';

defineOptions({
  name: 'IndexPage',
});

const authStore = useAuthStore();
const showKycModal = ref(false);

type HomeState = 'guest' | 'hasPhoneNoKyc' | 'hasKyc';

const { currentQuotes, currentCash, quotesStatus, cashStatus, refreshQuotes, refreshCash } = useHomeQuotes();
// The original decimal strings and quote metadata stay on their source objects.
// Round only the small table's presentation to two decimal places, without Number.
function displayRate(raw: string): string {
  const [whole = '0', fraction = ''] = raw.split('.');
  const cents = BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2)) +
    ((fraction[2] || '0') >= '5' ? 1n : 0n);
  const remainder = String(cents % 100n).padStart(2, '0').replace(/0+$/, '');
  return `${cents / 100n}${remainder ? `,${remainder}` : ''} ₽`;
}

const methodName = (method: SharedQuote['method']) => method === 'sbp' ? 'СБП' : 'Карта';
const quoteValue = (quote?: SharedQuote) => quote
  ? { value: displayRate(quote.rate), raw: quote.rate, quote }
  : { value: '—' };
const cashValue = (rate?: CashRate) => rate
  ? { value: displayRate(rate.attributes.rate), raw: rate.attributes.rate, rate }
  : { value: '—' };

const rateItems = computed(() => {
  const buys = currentQuotes.value.filter(quote => quote.type === 'buy');
  const sells = currentQuotes.value.filter(quote => quote.type === 'sell')
    .sort((a, b) => Number(b.method === 'sbp') - Number(a.method === 'sbp'));
  const sellOptions = sells.map(quote => ({
    id: quote.quote_id,
    method: methodName(quote.method),
    value: displayRate(quote.rate),
    raw: quote.rate,
    quote,
  }));
  const primarySell = sellOptions[0];
  const quotesEmpty = !buys.length && !sells.length;
  const quoteRow = {
    id: 'non-cash',
    name: 'Безналичный',
    buy: quoteValue(buys[0]),
    sell: primarySell
      ? { value: primarySell.value, raw: primarySell.raw, method: primarySell.method, options: sellOptions }
      : { value: '—' },
    notice: quotesStatus.value === 'loading' ? 'Загрузка…' :
      quotesStatus.value === 'error' ? 'Ошибка курса' :
        quotesEmpty ? 'Нет курса' : undefined,
    status: quotesStatus.value,
    retry: quotesStatus.value === 'error' || (quotesStatus.value === 'ready' && quotesEmpty)
      ? 'quotes' as const : undefined,
  };
  const extraBuys = buys.slice(1).map(quote => ({
    id: quote.quote_id,
    name: `Безналичный · ${methodName(quote.method)}`,
    buy: quoteValue(quote),
    sell: { value: '—' },
  }));
  const cashRows = currentCash.value.map(rate => ({
    id: rate.id,
    name: 'Наличный',
    buy: { value: '—' },
    sell: cashValue(rate),
  }));
  if (!cashRows.length) cashRows.push({
    id: 'cash',
    name: 'Наличный',
    buy: { value: '—' },
    sell: { value: '—' },
    notice: cashStatus.value === 'loading' ? 'Загрузка…' :
      cashStatus.value === 'error' ? 'Ошибка курса' : 'Нет курса',
    status: cashStatus.value,
    retry: cashStatus.value === 'error' || cashStatus.value === 'ready'
      ? 'cash' as const : undefined,
  } as typeof cashRows[number]);
  return [quoteRow, ...extraBuys, ...cashRows];
});

function refreshRates(source: 'quotes' | 'cash') {
  if (source === 'quotes') void refreshQuotes();
  else void refreshCash();
}

const demoRateItems = [
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

const kycCardStatus = computed<KycCardStatus | null>(() => {
  if (!authStore.isAuthenticated) {
    return null;
  }

  const status = authStore.verificationStatus;

  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status;
  }

  return null;
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
  margin-top: 30px;
}

.home-screen__kyc-status {
  margin-bottom: 16px;
}

.home-screen__image-card,
.home-screen__referral-card {
  margin-top: 16px;
}
</style>
