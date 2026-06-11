<template>
  <HomeImageCard
    @click="router.push('/referrals')"
    :src="refImage"
    label="Реферальная программа"
    :height="90"
  />
</template>

<script setup lang="ts">
import refImage from 'assets/refpng.png';
import HomeImageCard from 'components/home/HomeImageCard.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
defineOptions({
  name: 'HomeReferralCard',
});
</script>
