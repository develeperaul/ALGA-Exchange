<template>
  <span class="rub-bank-icon" :class="bank.iconClass" aria-hidden="true">
    <img v-if="bank.icon" :src="bank.icon" alt="">
    <span v-else class="rub-bank-icon__text">{{ bank.label.charAt(0) }}</span>
  </span>
</template>

<script setup lang="ts">
import type { RubBank } from 'pages/wallet/rubDepositData';

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
  width: 24px;
  height: 24px;
  display: block;
  object-fit: contain;
}

.rub-bank-icon--sber img,
.rub-bank-icon--mts img {
  width: 20px;
  height: 20px;
}

.rub-bank-icon--sbp {
  background: #D4F5DC;
}

.rub-bank-icon--sbp img {
  width: 16px;
  height: 20px;
}

.rub-bank-icon__text {
  color: currentColor;
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
}
</style>
