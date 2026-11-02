import { afterEach, beforeEach, vi } from 'vitest';

const blockFetch = () =>
  vi.fn(() => Promise.reject(new Error('Network requests are disabled in tests; mock fetch explicitly.')));

// Also cover imports that call fetch before the first test begins.
vi.stubGlobal('fetch', blockFetch());

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal('fetch', blockFetch());
});

afterEach(() => {
  vi.stubGlobal('fetch', blockFetch());
});
