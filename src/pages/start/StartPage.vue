<template>
  <div class="start-page">
    <main class="start-screen" aria-label="Стартовая страница">
      <header class="start-status" aria-hidden="true">
        <span class="start-status__time">9:41</span>

        <div class="start-status__icons">
          <img :src="cellularIcon" alt="">
          <img :src="wifiIcon" alt="">
          <img :src="batteryIcon" alt="">
        </div>
      </header>

      <section class="start-brand" aria-label="Aminex Pay">
        <div class="start-brand__logo-wrap">
          <img class="start-brand__logo" :src="logoImage" alt="Aminex Pay">
        </div>

        <h1 class="start-brand__title">AMINEX</h1>
        <p class="start-brand__subtitle">PAY</p>
        <span class="start-brand__line" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'StartPage',
});

const router = useRouter();
const batteryIcon = 'http://localhost:3845/assets/e220ec26012624ff7b239d4086513336a7df989f.svg';
const wifiIcon = 'http://localhost:3845/assets/7a11d652a509cea82defb776b662d6c85ed75bf5.svg';
const cellularIcon = 'http://localhost:3845/assets/142ca2d15aee1fb1def8e6a7e3b9ba41bc2cb100.svg';
const logoImage = 'http://localhost:3845/assets/ffa5853ec4a8d0867c8c682d5e2ee612910892c1.png';

let redirectTimer: number | undefined;

onMounted(() => {
  redirectTimer = window.setTimeout(() => {
    void router.replace('/auth');
  }, 1800);
});

onBeforeUnmount(() => {
  if (redirectTimer) {
    window.clearTimeout(redirectTimer);
  }
});
</script>

<style scoped lang="scss">
.start-page {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background: #f8f8f8;
}

.start-screen {
  width: 100%;
  min-height: 100vh;
  padding-top: var(--ui-safe-area-top);
  background: #f8f8f8;
}

.start-status {
  height: 44px;
  padding: 13px 16px 0 21px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.start-status__time {
  color: #262626;
  font-family: 'SF Pro Text', var(--ui-font-family);
  font-size: 15px;
  line-height: normal;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.start-status__icons {
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.start-status__icons img {
  display: block;
  flex: 0 0 auto;
}

.start-brand {
  padding-top: 133px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-brand__logo-wrap {
  width: 196px;
  height: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-brand__logo {
  width: 196px;
  height: 145px;
  display: block;
  object-fit: contain;
}

.start-brand__title {
  margin: 44px 0 0;
  color: #3c3c3c;
  font-family: 'Onest', var(--ui-font-family);
  font-size: 60.56px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 3.03px;
}

.start-brand__subtitle {
  margin: -2px 0 0;
  color: #3c3c3c;
  font-family: 'Onest', var(--ui-font-family);
  font-size: 38.931px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 11.68px;
}

.start-brand__line {
  width: 94px;
  height: 1px;
  margin-top: 5px;
  background: #3c3c3c;
}
</style>
