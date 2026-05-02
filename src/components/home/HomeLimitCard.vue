<template>
  <HomeImageCard
    :src="limitImage"
    label="Лимиты"
    :height="100"
  />
</template>

<script setup lang="ts">
import limitImage from 'assets/limit.png';
import HomeImageCard from 'components/home/HomeImageCard.vue';

defineOptions({
  name: 'HomeLimitCard',
});
</script>
