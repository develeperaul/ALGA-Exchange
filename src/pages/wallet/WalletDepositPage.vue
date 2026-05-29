<template>
  <q-page class="wallet-deposit-page">
    <main class="wallet-deposit" aria-label="Пополнить через USDT">
      <header class="wallet-deposit__header">
        <button class="wallet-deposit__back" type="button" aria-label="Назад" @click="goBack">
          <span aria-hidden="true" />
        </button>
        <h1 class="wallet-deposit__title">Пополнить через USDT</h1>
      </header>

      <section class="wallet-deposit__qr-wrap" aria-label="QR-код">
        <img class="wallet-deposit__qr" :src="qrImage" alt="QR-код для пополнения USDT">
      </section>

      <div class="wallet-deposit-field">
        <span class="wallet-deposit-field__label">Адрес кошелька</span>
        <span class="wallet-deposit-field__control">
          <span class="wallet-deposit-field__value">{{ walletAddress }}</span>
          <button class="wallet-deposit-field__copy" type="button" aria-label="Скопировать адрес" @click.prevent="copyAddress">
            <span aria-hidden="true" />
          </button>
        </span>
      </div>

      <div class="wallet-deposit-field wallet-deposit-field--network">
        <span class="wallet-deposit-field__label">Сеть</span>
        <button class="wallet-deposit-field__control wallet-deposit-field__control--button" type="button" @click="isNetworkSheetOpen = true">
          <span class="wallet-deposit-field__value">{{ selectedNetwork }}</span>
          <span class="wallet-deposit-field__chevron" aria-hidden="true" />
        </button>
      </div>

      <button class="wallet-deposit__submit" type="button">
        Я пополнил
      </button>
    </main>

    <UiBottomSheet
      v-model="isNetworkSheetOpen"
      aria-label="Сеть"
      panel-class="wallet-network-sheet"
      content-class="wallet-network-sheet__content"
      :show-handle="false"
      :closable="false"
    >
      <button class="wallet-network-sheet__close" type="button" aria-label="Закрыть" @click="isNetworkSheetOpen = false">
        <span aria-hidden="true" />
      </button>

      <h2 class="wallet-network-sheet__title">Сеть</h2>

      <button
        v-for="network in networks"
        :key="network"
        class="wallet-network-option"
        :class="{ 'wallet-network-option--active': network === selectedNetwork }"
        type="button"
        @click="selectNetwork(network)"
      >
        <span>{{ network }}</span>
        <span v-if="network === selectedNetwork" class="wallet-network-option__check" aria-hidden="true" />
      </button>
    </UiBottomSheet>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import qrImage from 'assets/wallet-deposit-qr.png';

defineOptions({
  name: 'WalletDepositPage',
});

const router = useRouter();
const walletAddress = 'siejdkaav1521sswol741gpsf51epaklvd';
const networks = ['USDT TRC 20', 'USDT TON'] as const;
const selectedNetwork = ref<(typeof networks)[number]>(networks[0]);
const isNetworkSheetOpen = ref(false);

function goBack() {
  void router.push('/wallet');
}

function selectNetwork(network: (typeof networks)[number]) {
  selectedNetwork.value = network;
  isNetworkSheetOpen.value = false;
}

function copyAddress() {
  void navigator.clipboard?.writeText(walletAddress);
}
</script>

<style scoped lang="scss">
.wallet-deposit-page {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
  background: var(--ui-surface-page);
}

.wallet-deposit {
  width: 100%;
  min-height: calc(100vh - var(--ui-footer-height));
  padding:
    calc(60px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    calc(32px + var(--ui-safe-area-bottom))
    calc(16px + var(--ui-safe-area-left));
  color: var(--ui-text-primary);
  font-family: var(--ui-font-family);
}

.wallet-deposit__header {
  height: 32px;
  position: relative;
  display: grid;
  place-items: center;
}

.wallet-deposit__back {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  background: var(--ui-surface-white);
  color: var(--ui-text-muted);
  cursor: pointer;
}

.wallet-deposit__back span {
  width: 10px;
  height: 10px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateX(2px) rotate(45deg);
}

.wallet-deposit__title {
  margin: 0;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h1);
  line-height: var(--ui-line-h1);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.wallet-deposit__qr-wrap {
  width: 200px;
  height: 200px;
  margin: 17px auto 0;
  border-radius: 24px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--ui-surface-white);
}

.wallet-deposit__qr {
  width: 154px;
  height: 152px;
  display: block;
  object-fit: cover;
}

.wallet-deposit-field {
  margin-top: 25px;
  display: grid;
  gap: 14px;
}

.wallet-deposit-field--network {
  margin-top: 20px;
}

.wallet-deposit-field__label {
  color: var(--ui-text-primary);
  font-size: var(--ui-font-t1);
  line-height: var(--ui-line-t1);
  font-weight: 400;
  letter-spacing: -0.3px;
}

.wallet-deposit-field__control {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border: 0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  text-align: left;
}

.wallet-deposit-field__control--button {
  cursor: pointer;
}

.wallet-deposit-field__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  letter-spacing: 0;
}

.wallet-deposit-field__copy {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--ui-text-muted);
  cursor: pointer;
}

.wallet-deposit-field__copy span {
  width: 13px;
  height: 15px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  position: relative;
}

.wallet-deposit-field__copy span::before {
  content: "";
  width: 13px;
  height: 15px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  position: absolute;
  top: -4px;
  left: -5px;
  background: var(--ui-surface-white);
}

.wallet-deposit-field__chevron {
  width: 8px;
  height: 8px;
  justify-self: end;
  border-right: 1.5px solid var(--ui-text-muted);
  border-bottom: 1.5px solid var(--ui-text-muted);
  transform: rotate(45deg);
}

.wallet-deposit__submit {
  width: 100%;
  height: 50px;
  margin-top: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: var(--ui-brand-primary);
  color: var(--ui-text-inverse);
  font-size: var(--ui-font-button);
  line-height: var(--ui-line-button);
  font-weight: 600;
  letter-spacing: -0.3px;
  cursor: pointer;
}

:global(.wallet-network-sheet) {
  min-height: 185px;
  padding: 22px 0 30px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: none;
}

:global(.wallet-network-sheet__content) {
  padding: 0;
  position: relative;
  overflow: visible;
}

.wallet-network-sheet__close {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  position: absolute;
  top: 0;
  right: 16px;
  background: transparent;
  color: #C9C9C9;
  cursor: pointer;
}

.wallet-network-sheet__close span::before,
.wallet-network-sheet__close span::after {
  content: "";
  width: 18px;
  height: 2px;
  border-radius: 2px;
  position: absolute;
  top: 11px;
  left: 3px;
  background: currentColor;
}

.wallet-network-sheet__close span::before {
  transform: rotate(45deg);
}

.wallet-network-sheet__close span::after {
  transform: rotate(-45deg);
}

.wallet-network-sheet__title {
  margin: 26px 16px 16px;
  color: var(--ui-text-primary);
  font-size: var(--ui-font-h3);
  line-height: var(--ui-line-h3);
  font-weight: 500;
  letter-spacing: -0.3px;
}

.wallet-network-option {
  width: 100%;
  height: 35px;
  padding: 0 16px;
  border: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
  gap: 10px;
  background: var(--ui-surface-white);
  color: var(--ui-text-primary);
  text-align: left;
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  font-weight: 400;
  cursor: pointer;
}

.wallet-network-option--active {
  background: var(--ui-brand-light);
  color: var(--ui-text-brand);
}

.wallet-network-option__check {
  width: 16px;
  height: 9px;
  justify-self: end;
  border-left: 2px solid var(--ui-brand-primary);
  border-bottom: 2px solid var(--ui-brand-primary);
  transform: translateY(-2px) rotate(-45deg);
}
</style>
