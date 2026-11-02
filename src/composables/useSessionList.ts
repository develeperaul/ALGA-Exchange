import { shallowRef, ref, watch, onScopeDispose } from 'vue';
import { onSessionChange } from '@/api/session';
import { useSessionRead, invalidateSessionRead } from './useSessionRead';
import type { Page, Resource } from '@/api/activity';

export function useSessionList<A>(key: () => string, fetcher: (cursor: string | undefined, signal: AbortSignal) => Promise<Page<A>>, enabled = () => true) {
  const cursor = ref('');
  const items = shallowRef<Resource<A>[]>([]);
  const next = ref<string | null>(null);
  const read = useSessionRead(() => `${key()}:${cursor.value}`, signal => fetcher(cursor.value || undefined, signal), enabled);
  function reset() { items.value = []; next.value = null; cursor.value = ''; }
  watch(() => [key(), enabled()], reset, { flush: 'sync' });
  const stopSession = onSessionChange(reset);
  watch(read.data, page => {
    if (!page) return;
    const merged = cursor.value ? [...items.value, ...page.items] : page.items;
    items.value = [...new Map(merged.map(item => [item.id, item])).values()];
    next.value = page.next === cursor.value ? null : page.next;
  }, { immediate: true, flush: 'sync' });
  onScopeDispose(stopSession);
  async function refresh() {
    invalidateSessionRead(`${key()}:`);
    items.value = []; next.value = null;
    if (cursor.value) cursor.value = '';
    else await read.refresh();
  }
  function loadMore() { if (!read.loading.value && next.value) cursor.value = next.value; }
  return { items, next, error: read.error, loading: read.loading, retry: read.refresh, refresh, loadMore };
}
