<template>
  <article @click="goKyc" class="home-kyc-promo-card" aria-label="Верификация">
    <div class="home-kyc-promo-card__copy">
      <h2>Совершайте выгодные безналичные обмены</h2>
      <p>Пройдите верификацию за пару шагов</p>
    </div>

    <div class="home-kyc-promo-card__image" aria-hidden="true">
      <img src="~assets/passport.png" alt="" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({
  name: 'HomeKycPromoCard',
});
const router = useRouter();
function goKyc() {
  void router.push('/kyc');
}
</script>

<style scoped lang="scss">
.home-kyc-promo-card {
  width: 100%;
  min-height: 100px;
  padding: 16px 20px;
  border-radius: 16px;
  display: grid;

  align-items: center;
  gap: 16px;
  background: linear-gradient(101deg, #2E303D 7.43%, #535D76 107.43%);
  box-shadow: 0 2px 9px rgb(0 0 0 / 5%);
  position: relative;
}
.home-kyc-promo-card__copy {
  position: relative;
  z-index: 1;
}
.home-kyc-promo-card__copy h2,
.home-kyc-promo-card__copy p {
  margin: 0;
}

.home-kyc-promo-card__copy h2 {
  color: var(--ui-text-inverse);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.home-kyc-promo-card__copy p {
  margin-top: 8px;
  color: rgb(255 255 255 / 82%);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
  letter-spacing: -0.3px;
}

.home-kyc-promo-card__image {
  position: absolute;
  bottom: 0;
  right: 20px;

}


.home-kyc-promo-card__line {
  height: 2px;
  position: absolute;
  left: 17px;
  background: rgb(255 255 255 / 36%);
}

.home-kyc-promo-card__line--short {
  width: 18px;
  bottom: 16px;
}

.home-kyc-promo-card__line--long {
  width: 34px;
  right: 12px;
  left: auto;
  bottom: 10px;
}
</style>
