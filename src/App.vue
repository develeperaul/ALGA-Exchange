<template>
  <div class="app-shell">
    <div class="app-device-frame" aria-hidden="true">
      <span class="app-device-frame__speaker" />
      <span class="app-device-frame__camera" />
    </div>

    <div class="app-device-screen">
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'App'
});
</script>
