import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useAuthStore } from './auth-store'
import { useKycStore } from './kyc-store'
import { usePaymentsStore } from './payments-store'
import { Router } from 'vue-router';
import { isMockMode } from '@/api/config';
import { onSessionChange } from '@/api/session';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  if (typeof window !== 'undefined') {
    const kyc = useKycStore(pinia);
    const payments = usePaymentsStore(pinia);
    onSessionChange(() => {
      kyc.reset();
      payments.$reset();
    });
    void useAuthStore(pinia).restore();
    if (isMockMode) {
      kyc.hydrate();
      payments.syncPayments();
    }
  }

  return pinia
})
