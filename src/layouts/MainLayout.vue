<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <q-page-container class="main-layout__page-container" >
      <router-view />
    </q-page-container>

    <q-footer class="main-layout__footer">
      <div class="main-layout__footer-frame">
        <UiFooter
          :active="activeFooterItem"
          @update:active="navigateFooter"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UiFooter, { UiFooterItemKey } from 'components/ui/UiFooter.vue';

defineOptions({
  name: 'MainLayout',
});

const route = useRoute();
const router = useRouter();

const footerRoutes: Record<UiFooterItemKey, string> = {
  home: '/',
  orders: '/orders',
  referrals: '/referrals',
  profile: '/profile',
};

const activeFooterItem = computed<UiFooterItemKey>(() => {
  if (route.path.startsWith('/orders')) {
    return 'orders';
  }

  if (route.path.startsWith('/referrals')) {
    return 'referrals';
  }

  if (route.path.startsWith('/profile')) {
    return 'profile';
  }

  return 'home';
});

function navigateFooter(item: UiFooterItemKey) {
  const target = footerRoutes[item];

  if (target !== route.path) {
    void router.push(target);
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  background: var(--ui-surface-page);
}

.main-layout__footer {
  padding-bottom: var(--ui-safe-area-bottom);
  display: flex;
  background: var(--ui-surface-white);
  box-shadow: none;
}

.main-layout__footer-frame {
  width: 100%;
}

.main-layout__footer :deep(.ui-footer) {
  width: 100%;
  max-width: 100%;
}

.main-layout__page-container {
  height: 100vh;
  overflow: auto;
}
</style>
