<template>
  <HomeImageCard
    :src="refImage"
    label="Реферальная программа"
    :height="90"
  />
</template>

<script setup lang="ts">
import refImage from 'assets/refpng.png';
import HomeImageCard from 'components/home/HomeImageCard.vue';

defineOptions({
  name: 'HomeReferralCard',
});
</script>
