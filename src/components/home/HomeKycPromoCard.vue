<template>
  <article class="home-kyc-promo-card" aria-label="Верификация">
    <div class="home-kyc-promo-card__copy">
      <h2>Совершайте выгодные безналичные обмены</h2>
      <p>Пройдите верификацию за пару шагов</p>
    </div>

    <div class="home-kyc-promo-card__visual" aria-hidden="true">
      <span class="home-kyc-promo-card__orb" />
      <span class="home-kyc-promo-card__line home-kyc-promo-card__line--short" />
      <span class="home-kyc-promo-card__line home-kyc-promo-card__line--long" />
    </div>
  </article>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeKycPromoCard',
});
</script>

<style scoped lang="scss">
.home-kyc-promo-card {
  width: 100%;
  min-height: 100px;
  padding: 18px 20px;
  border-radius: var(--ui-radius-card);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 74px;
  align-items: center;
  gap: 16px;
  background: linear-gradient(101deg, #2E303D 7.43%, #535D76 107.43%);
  box-shadow: 0 2px 9px rgb(0 0 0 / 5%);
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
}

.home-kyc-promo-card__visual {
  width: 74px;
  height: 64px;
  border-radius: 0 12px 12px 0;
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgb(50 119 255 / 35%) 0%, rgb(10 33 91 / 80%) 100%),
    #1740A4;
}

.home-kyc-promo-card__orb {
  width: 26px;
  height: 26px;
  border: 1px solid rgb(255 255 255 / 32%);
  border-radius: 50%;
  position: absolute;
  top: 14px;
  left: 21px;
}

.home-kyc-promo-card__orb::before,
.home-kyc-promo-card__orb::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 50%;
}

.home-kyc-promo-card__orb::before {
  transform: scaleX(0.55);
}

.home-kyc-promo-card__orb::after {
  transform: scaleY(0.55);
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
