import type { KyInstance } from 'ky';

const NETWORK_DISABLED_MESSAGE = 'HTTP API отключён в mock MVP';

/**
 * Safety guard for the standalone MVP.
 *
 * Auth, KYC and payments use local typed mocks. Keeping this export prevents
 * legacy imports from becoming compile errors while guaranteeing that an
 * accidental old API call cannot reach a backend.
 */
export const apiClient = new Proxy({} as KyInstance, {
  get() {
    return () => {
      throw new Error(NETWORK_DISABLED_MESSAGE);
    };
  },
});
