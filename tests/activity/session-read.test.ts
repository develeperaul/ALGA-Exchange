import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick, ref, type EffectScope } from 'vue';
import { flushPromises } from '@vue/test-utils';
let scopes: EffectScope[];
beforeEach(() => { vi.resetModules(); scopes = []; });
afterEach(() => { scopes.forEach(scope => scope.stop()); });
function scoped<T>(fn: () => T): T { const scope = effectScope(); scopes.push(scope); return scope.run(fn)!; }
async function setup() {
  const session = await import('../../src/api/session');
  session.replaceSession({ token: 'read-session-A', expires_at: null });
  const { useSessionRead } = await import('../../src/composables/useSessionRead');
  const { useSessionList } = await import('../../src/composables/useSessionList');
  return { session, useSessionRead, useSessionList };
}
describe('session-scoped activity cache', () => {
  it('reuses loaded data on navigation and drops it on logout', async () => {
    const { session, useSessionRead } = await setup();
    const fetcher = vi.fn().mockResolvedValue({ available: '7.123456' });
    const first = scoped(() => useSessionRead(() => 'balance', fetcher));
    await flushPromises(); expect(first.data.value).toEqual({ available: '7.123456' });
    scopes[0].stop();
    const again = scoped(() => useSessionRead(() => 'balance', fetcher));
    expect(fetcher).toHaveBeenCalledTimes(1); expect(again.data.value).toEqual(first.data.value);
    session.clearSession(); await nextTick();
    expect(again.data.value).toBeNull();
  });
  it('ignores late responses from previous account and after unmount', async () => {
    const { session, useSessionRead } = await setup();
    let resolveOld!: (value: string) => void;
    const fetcher = vi.fn().mockImplementationOnce(() => new Promise<string>(resolve => { resolveOld = resolve; }))
      .mockResolvedValue('account-B');
    const read = scoped(() => useSessionRead(() => 'private', fetcher));
    session.replaceSession({ token: 'read-session-B', expires_at: null });
    await flushPromises(); expect(read.data.value).toBe('account-B');
    resolveOld('account-A'); await nextTick(); expect(read.data.value).toBe('account-B');
    scopes[0].stop();
    expect(fetcher.mock.calls[0][0].aborted).toBe(true);
  });
  it('starts cached paginated views with items and refreshes page one after loading more', async () => {
    const { useSessionList } = await setup();
    const fetcher = vi.fn().mockImplementation(async (cursor?: string) => ({
      items: [{ id: cursor ? '2' : '1', type: 'items', attributes: { value: cursor ?? 'first' } }], next: cursor ? null : 'page=2',
    }));
    const read = scoped(() => useSessionList(() => 'history', fetcher));
    await flushPromises(); expect(read.items.value.map(x => x.id)).toEqual(['1']);
    read.loadMore(); await flushPromises(); expect(read.items.value.map(x => x.id)).toEqual(['1', '2']);
    await read.refresh(); await flushPromises();
    expect(fetcher).toHaveBeenCalledTimes(3); expect(read.items.value.map(x => x.id)).toEqual(['1']);
    scopes[0].stop();
    const cached = scoped(() => useSessionList(() => 'history', fetcher));
    expect(cached.items.value.map(x => x.id)).toEqual(['1']);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it('clears old filter rows immediately and does not append an old page after filter switch', async () => {
    const { useSessionList } = await setup();
    const kind = ref('old');
    let finish!: (value: unknown) => void;
    const fetcher = vi.fn().mockResolvedValueOnce({ items: [{ id: 'old', type: 'items', attributes: {} }], next: 'page=2' })
      .mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }))
      .mockResolvedValue({ items: [{ id: 'new', type: 'items', attributes: {} }], next: null });
    const read = scoped(() => useSessionList(() => kind.value, fetcher));
    await flushPromises(); read.loadMore(); await flushPromises();
    kind.value = 'new'; expect(read.items.value).toEqual([]);
    await flushPromises();
    finish({ items: [{ id: 'stale', type: 'items', attributes: {} }], next: null });
    await flushPromises(); expect(read.items.value.map(x => x.id)).toEqual(['new']);
  });
});
