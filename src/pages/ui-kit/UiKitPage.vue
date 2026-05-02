<template>
  <q-page class="ui-kit-page">
    <main class="ui-kit">
      <header class="ui-kit__header">
        <h1>UI Kit</h1>
      </header>

      <section class="ui-kit__section">
        <h2>Buttons</h2>
        <div class="ui-kit__grid">
          <UiButton size="large">Large primary</UiButton>
          <UiButton size="medium">Medium primary</UiButton>
          <UiButton size="mini">Mini primary</UiButton>
          <UiButton variant="neutral">Neutral</UiButton>
          <UiButton disabled>Disabled</UiButton>
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Inputs</h2>
        <div class="ui-kit__grid">
          <UiInput
            v-model="inputValue"
            name="ui-kit-input"
            label="Default"
            placeholder="Введите сумму"
            hint="Hint text"
            suffix="USDT"
          />
          <UiInput
            name="ui-kit-input-error"
            label="Error"
            model-value=""
            placeholder="Ошибка"
            validate-on-mount
            :rules="requiredRule"
          />
          <UiInput
            name="ui-kit-input-disabled"
            label="Disabled"
            model-value="Недоступно"
            disabled
          />
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Controls</h2>
        <div class="ui-kit__grid">
          <UiCheckbox v-model="checkboxUnchecked" label="Unchecked" />
          <UiCheckbox v-model="checkboxChecked" label="Checked" />
          <UiTabs v-model="activeTab" :options="tabOptions" />
          <UiCodeInput v-model="codeSix" name="ui-kit-code-six" />
          <UiCodeInput v-model="codeFive" name="ui-kit-code-five" :length="5" />
          <UiVerifiedField
            name="Иванченко Николай Аркадьевич"
            number="+7 927 000 00 00"
          />
          <UiVerifiedField name="Иванченко Николай Аркадьевич" />
          <UiStageField />
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Home</h2>
        <div class="ui-kit__grid">
          <HomeExchangeHero />
          <HomeAuthBanner />
          <HomeActionCard />
          <HomeRateTable />
          <HomeActionsCard />
          <HomeLimitCard />
          <HomeReferralCard />
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Orders</h2>
        <div class="ui-kit__grid">
          <OrderRequestCard
            status="processing"
            title="Заявка #1248"
            subtitle="USDT → RUB"
            date="30.04.26"
            amount="1200 USDT"
          />
          <OrderRequestCard
            status="completed"
            title="Заявка #1247"
            subtitle="RUB → USDT"
            date="29.04.26"
            amount="+840 USDT"
          />
          <OrderRequestCard
            status="cancelled"
            title="Заявка #1246"
            subtitle="USDT → RUB"
            date="28.04.26"
            amount="-300 USDT"
            amount-tone="danger"
          />
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Wallet</h2>
        <div class="ui-kit__panel">
          <WalletOperationRow
            direction="in"
            title="Пополнение"
            subtitle="TRC20"
            amount="+500 USDT"
            tone="positive"
            date="30.04.26"
          />
          <WalletOperationRow
            direction="out"
            title="Вывод"
            subtitle="TRC20"
            amount="-120 USDT"
            date="29.04.26"
          />
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Referrals</h2>
        <div class="ui-kit__grid">
          <ReferralBalanceCard amount="1250.00" />
          <ReferralIncomeCard value="420 USDT" />
          <ReferralLinkField value="https://alga.exchange/ref/demo" />
          <ReferralPromoCard
            title="Приглашайте друзей и получайте доход"
            :image="referralImage"
          />
          <ReferralPromoCard
            title="Станьте инфлюенсером ALGA"
            variant="influencer"
            :image="influencerImage"
          />
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Navigation / Overlay</h2>
        <div class="ui-kit__grid">
          <UiFooter v-model:active="footerActive" />
          <UiButton @click="bottomSheetOpen = true">Open bottom sheet</UiButton>
        </div>
      </section>

      <section class="ui-kit__section">
        <h2>Legacy</h2>
        <div class="ui-kit__panel">
          <EssentialLink
            title="Essential link"
            caption="Quasar item state"
            link="#"
            icon="link"
          />
          <ExampleComponent
            title="Example component"
            active
            :todos="todos"
            :meta="meta"
          />
        </div>
      </section>
    </main>

    <UiBottomSheet
      v-model="bottomSheetOpen"
      title="Bottom sheet"
      aria-label="UI kit bottom sheet"
    >
      <p class="ui-kit__sheet-text">
        Content state
      </p>
      <template #footer>
        <UiButton @click="bottomSheetOpen = false">Close</UiButton>
      </template>
    </UiBottomSheet>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import ExampleComponent from 'components/ExampleComponent.vue';
import HomeActionCard from 'components/home/HomeActionCard.vue';
import HomeActionsCard from 'components/home/HomeActionsCard.vue';
import HomeAuthBanner from 'components/home/HomeAuthBanner.vue';
import HomeExchangeHero from 'components/home/HomeExchangeHero.vue';
import HomeLimitCard from 'components/home/HomeLimitCard.vue';
import HomeRateTable from 'components/home/HomeRateTable.vue';
import HomeReferralCard from 'components/home/HomeReferralCard.vue';
import OrderRequestCard from 'components/orders/OrderRequestCard.vue';
import ReferralBalanceCard from 'components/referrals/ReferralBalanceCard.vue';
import ReferralIncomeCard from 'components/referrals/ReferralIncomeCard.vue';
import ReferralLinkField from 'components/referrals/ReferralLinkField.vue';
import ReferralPromoCard from 'components/referrals/ReferralPromoCard.vue';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiCheckbox from 'components/ui/UiCheckbox.vue';
import UiCodeInput from 'components/ui/UiCodeInput.vue';
import UiFooter, { type UiFooterItemKey } from 'components/ui/UiFooter.vue';
import UiInput from 'components/ui/UiInput.vue';
import UiStageField from 'components/ui/UiStageField.vue';
import UiTabs, { type UiTabOption } from 'components/ui/UiTabs.vue';
import UiVerifiedField from 'components/ui/UiVerifiedField.vue';
import WalletOperationRow from 'components/wallet/WalletOperationRow.vue';
import influencerImage from 'assets/referrals/influencer-1.png';
import referralImage from 'assets/referrals/my-referrals.png';
import type { Meta, Todo } from 'components/models';

defineOptions({
  name: 'UiKitPage',
});

const inputValue = ref('1250');
const checkboxUnchecked = ref(false);
const checkboxChecked = ref(true);
const activeTab = ref('withdraw');
const codeSix = ref('123');
const codeFive = ref('987');
const footerActive = ref<UiFooterItemKey>('home');
const bottomSheetOpen = ref(false);

const tabOptions: UiTabOption[] = [
  { label: 'Вывод', value: 'withdraw' },
  { label: 'Пополнение', value: 'deposit' },
];

const requiredRule = (value: string) => Boolean(value) || 'Обязательное поле';

const todos: Todo[] = [
  { id: 1, content: 'Default' },
  { id: 2, content: 'Active' },
];

const meta: Meta = {
  totalCount: 2,
};
</script>

<style scoped lang="scss">
.ui-kit-page {
  min-height: 100vh;
  background: var(--ui-surface-page);
}

.ui-kit {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding:
    calc(24px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(40px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.ui-kit__header h1,
.ui-kit__section h2 {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0;
}

.ui-kit__header h1 {
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
}

.ui-kit__section {
  margin-top: 28px;
}

.ui-kit__section h2 {
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
}

.ui-kit__grid,
.ui-kit__panel {
  margin-top: 14px;
}

.ui-kit__grid {
  display: grid;
  gap: 12px;
}

.ui-kit__panel {
  padding: 16px;
  border-radius: var(--ui-radius-sheet);
  display: grid;
  gap: 16px;
  background: var(--ui-surface-white);
}

.ui-kit__sheet-text {
  margin: 0;
  color: var(--ui-text-secondary);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}
</style>
