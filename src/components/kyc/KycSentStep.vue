<template>
  <section class="kyc-sent" aria-label="Данные отправлены">


    <main class="kyc-sent__content">
      <section class="kyc-sent__hero" aria-hidden="true">
        <div class="kyc-sent__shadow">
          <img class="kyc-sent__shadow-image" :src="shadowImage" alt="">
        </div>
        <div class="kyc-sent__card">
          <img class="kyc-sent__card-image" :src="cardImage" alt="">
        </div>
        <img class="kyc-sent__plane" :src="planeImage" alt="">
      </section>

      <h1 class="kyc-sent__title">Данные отправлены</h1>
      <p class="kyc-sent__description">Нам потребуется немного времени для проверки</p>
      <UiButton class="kyc-sent__button" @click="goHome">
        На главную
      </UiButton>
    </main>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import UiButton from 'components/ui/UiButton.vue';
import cardImage from 'src/assets/kyc/kyc-result-card.svg';
import planeImage from 'src/assets/kyc/kyc-result-plane.png';
import shadowImage from 'src/assets/kyc/kyc-result-shadow.svg';

defineOptions({
  name: 'KycSentStep',
});

const router = useRouter();

function goHome() {
  void router.replace('/');
}
</script>

<style scoped lang="scss">
.kyc-sent {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.kyc-sent__status {
  height: 44px;
  padding:
    calc(13px + var(--ui-safe-area-top))
    calc(16px + var(--ui-safe-area-right))
    0
    calc(21px + var(--ui-safe-area-left));
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.kyc-sent__time {
  color: #262626;
  font-family: 'SF Pro Text', var(--ui-font-family);
  font-size: 15px;
  line-height: normal;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.kyc-sent__status-icons {
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.kyc-sent__status-icons img {
  display: block;
  flex: 0 0 auto;
}

.kyc-sent__content {
  flex: 1 1 auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kyc-sent__hero {
  width: 221px;
  height: 151px;
  position: relative;
}

.kyc-sent__shadow {
  width: 221px;
  height: 16px;
  position: absolute;
  left: 0;
  top: 135px;
}

.kyc-sent__shadow-image {
  width: 221px;
  height: 136px;
  position: absolute;
  left: 0;
  bottom: -60px;
  display: block;
}

.kyc-sent__card {
  width: 150px;
  height: 105px;
  position: absolute;
  left: 35.5px;
  top: 41px;
}

.kyc-sent__card-image {
  width: 150px;
  height: 105px;
  display: block;
}

.kyc-sent__plane {
  width: 146px;
  height: 146px;
  position: absolute;
  left: 38px;
  top: 0;
  display: block;
}

.kyc-sent__title {
  margin: 22px 0 0;
  color: #262626;
  font-size: 20px;
  line-height: normal;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.kyc-sent__description {
  width: 267px;
  margin: 8px 0 0;
  color: #262626;
  text-align: center;
  font-size: 16px;
  line-height: normal;
  font-weight: 400;
  letter-spacing: -0.3px;
}

.kyc-sent__button {
  width: calc(100% - 32px);
  margin-top: 34px;
}
</style>
