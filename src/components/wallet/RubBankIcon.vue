<template>
  <span class="rub-bank-icon" :class="bank.iconClass" aria-hidden="true">
    <template v-if="bank.id === 'sovcombank'">
      <img class="rub-bank-icon__sov rub-bank-icon__sov--a" :src="sovcombankIconParts[0]" alt="">
      <img class="rub-bank-icon__sov rub-bank-icon__sov--b" :src="sovcombankIconParts[1]" alt="">
    </template>
    <img v-else-if="bank.icon" :src="bank.icon" alt="">
    <span v-else class="rub-bank-icon__text">{{ bank.iconText }}</span>
  </span>
</template>

<script setup lang="ts">
import { sovcombankIconParts, type RubBank } from 'pages/wallet/rubDepositData';

defineProps<{
  bank: RubBank;
}>();

defineOptions({
  name: 'RubBankIcon',
});
</script>

<style scoped lang="scss">
.rub-bank-icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #F2F3F5;
}

.rub-bank-icon img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
}

.rub-bank-icon--sber img {
  width: 20px;
  height: 20px;
}

.rub-bank-icon--tbank img,
.rub-bank-icon--vtb img {
  width: 24px;
  height: 24px;
}

.rub-bank-icon--mts img {
  width: 20px;
  height: 20px;
  border-radius: 8px;
}

.rub-bank-icon--sbp {
  background: #D4F5DC;
}

.rub-bank-icon--sbp img {
  width: 16px;
  height: 20px;
}

.rub-bank-icon--sovcombank {
  background: #F4F6F8;
}

.rub-bank-icon__text {
  color: currentColor;
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
}

.rub-bank-icon--alfa {
  background: var(--ui-surface-white);
  color: #EF3124;
}

.rub-bank-icon--rencredit {
  background: var(--ui-surface-white);
  color: #E63C8A;
}

.rub-bank-icon--otp {
  background: #C8F344;
  color: #173B13;
}

.rub-bank-icon--ozon {
  background: #005BFF;
  color: var(--ui-text-inverse);
}

.rub-bank-icon--raiffeisen {
  background: #FFE500;
  color: #111111;
}

.rub-bank-icon--ubrir {
  background: var(--ui-surface-white);
  color: #E91E63;
}

.rub-bank-icon--uralsib {
  background: var(--ui-surface-white);
  color: #3E176E;
}

.rub-bank-icon--yandex {
  background: #111111;
  color: var(--ui-text-inverse);
}

.rub-bank-icon--mkb {
  background: #D93C32;
  color: var(--ui-text-inverse);
}

.rub-bank-icon--kazan {
  background: var(--ui-surface-white);
  color: #7AC143;
}

.rub-bank-icon--inbank {
  background: var(--ui-surface-white);
  color: #1D8B75;
}

.rub-bank-icon__sov {
  position: absolute;
}

.rub-bank-icon__sov--a {
  width: 16px;
  height: 22px;
  right: 2px;
}

.rub-bank-icon__sov--b {
  width: 12px;
  height: 24px;
  left: 2px;
}
</style>
