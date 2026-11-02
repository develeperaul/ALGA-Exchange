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
import { onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth-store';

const auth = useAuthStore();
let wasHidden = false;
function refreshSessionData() {
  if (auth.token) void auth.fetchProfile({ background: true }).catch(() => {});
}
function onVisibilityChange() {
  if (document.visibilityState === 'hidden') wasHidden = true;
  else if (wasHidden) { wasHidden = false; refreshSessionData(); }
}
function onPageShow(event: PageTransitionEvent) {
  if (event.persisted) refreshSessionData();
}
onMounted(() => {
  // Router restoration and login use this same deduplicated session bootstrap.
  void auth.restore();
  wasHidden = document.visibilityState === 'hidden';
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pageshow', onPageShow);
});
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange);
  window.removeEventListener('pageshow', onPageShow);
});

defineOptions({
  name: 'App'
});
</script>
