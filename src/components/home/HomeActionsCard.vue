<template>
  <HomeImageCard
    :src="actionsImage"
    label="Действия"
    :height="100"
  />
</template>

<script setup lang="ts">
import actionsImage from 'assets/actions.png';
import HomeImageCard from 'components/home/HomeImageCard.vue';

defineOptions({
  name: 'HomeActionsCard',
});
</script>
