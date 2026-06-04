<template>
  <article class="home-limits-promo-card" aria-label="Лимиты">
    <div class="home-limits-promo-card__copy">
      <h2>Снижаем лимиты вывода средств</h2>
      <p>С 1 000 RUB до 500 RUB</p>
    </div>

    <div class="home-limits-promo-card__coin" aria-hidden="true">
      <span class="home-limits-promo-card__coin-ring" />
      <span class="home-limits-promo-card__coin-core" />
      <span class="home-limits-promo-card__coin-sign" />
    </div>
  </article>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeLimitsPromoCard',
});
</script>

<style scoped lang="scss">
.home-limits-promo-card {
  width: 100%;
  min-height: 100px;
  padding: 18px 20px;
  border-radius: var(--ui-radius-card);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 88px;
  align-items: center;
  gap: 12px;
  background: linear-gradient(90deg, #FF8A00 0%, #FFD000 100%);
  box-shadow: 0 2px 9px rgb(0 0 0 / 5%);
}

.home-limits-promo-card__copy h2,
.home-limits-promo-card__copy p {
  margin: 0;
}

.home-limits-promo-card__copy h2 {
  color: var(--ui-text-inverse);
  font-size: var(--ui-font-h2);
  line-height: var(--ui-line-h2);
  font-weight: 600;
  letter-spacing: -0.3px;
}

.home-limits-promo-card__copy p {
  margin-top: 8px;
  color: rgb(255 255 255 / 92%);
  font-size: var(--ui-font-t2);
  line-height: var(--ui-line-t2);
}

.home-limits-promo-card__coin {
  width: 84px;
  height: 84px;
  position: relative;
  justify-self: end;
}

.home-limits-promo-card__coin-ring,
.home-limits-promo-card__coin-core {
  border-radius: 50%;
  position: absolute;
  inset: 0;
}

.home-limits-promo-card__coin-ring {
  background: radial-gradient(circle at 30% 30%, #B9FF7C 0%, #2E8E2E 78%);
}

.home-limits-promo-card__coin-core {
  inset: 8px;
  border: 2px solid rgb(255 255 255 / 22%);
  background: radial-gradient(circle at 32% 30%, #6EEA64 0%, #167B2E 76%);
}

.home-limits-promo-card__coin-sign {
  width: 28px;
  height: 40px;
  position: absolute;
  top: 22px;
  left: 28px;
}

.home-limits-promo-card__coin-sign::before,
.home-limits-promo-card__coin-sign::after {
  content: "";
  position: absolute;
  background: #F2D18C;
  box-shadow: 0 0 0 1px rgb(122 93 26 / 25%);
}

.home-limits-promo-card__coin-sign::before {
  width: 10px;
  height: 40px;
  left: 9px;
  border-radius: 999px;
}

.home-limits-promo-card__coin-sign::after {
  width: 28px;
  height: 8px;
  top: 7px;
  left: 0;
  border-radius: 999px;
  box-shadow:
    0 14px 0 0 #F2D18C,
    0 14px 0 1px rgb(122 93 26 / 25%);
}
</style>
