import { shallowRef, ref, watch, onScopeDispose } from 'vue';
import { getSessionScope, isCurrentSession, isValidSession, onSessionChange } from '@/api/session';

const cache = new Map<string, { value: unknown; time: number }>();
onSessionChange(() => cache.clear());

export function invalidateSessionRead(prefix: string) {
  const scoped = `${getSessionScope().epoch}:${prefix}`;
  for (const key of cache.keys()) if (key.startsWith(scoped)) cache.delete(key);
}

/** Short-lived, session-scoped memory cache; cancellation and late-response isolation. */
export function useSessionRead<T>(key: () => string, fetcher: (signal: AbortSignal) => Promise<T>, enabled = () => true) {
  const data = shallowRef<T | null>(null);
  const error = ref('');
  const loading = ref(false);
  const epoch = ref(getSessionScope().epoch);
  let controller: AbortController | null = null;
  let revision = 0;
  let disposed = false;
  async function load(force = false) {
    controller?.abort();
    const ticket = ++revision;
    const scope = getSessionScope();
    data.value = null; error.value = ''; loading.value = false;
    if (disposed || !enabled() || !key()) return;
    if (!isValidSession(scope.session)) { error.value = 'Сессия завершена. Войдите снова.'; return; }
    const cacheKey = `${scope.epoch}:${key()}`;
    const saved = cache.get(cacheKey);
    if (!force && saved && Date.now() - saved.time < 30000) { data.value = saved.value as T; return; }
    const requestController = new AbortController();
    controller = requestController; loading.value = true;
    const current = () => !disposed && ticket === revision && isCurrentSession(scope.epoch) && !requestController.signal.aborted;
    try {
      const value = await fetcher(requestController.signal);
      if (!current()) return;
      data.value = value;
      if (cache.size >= 64) cache.delete(cache.keys().next().value!);
      cache.set(cacheKey, { value, time: Date.now() });
    } catch (cause) {
      if (current()) error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить данные';
    } finally { if (current()) loading.value = false; }
  }
  const stopSession = onSessionChange(() => {
    controller?.abort(); revision++; data.value = null; error.value = ''; loading.value = false;
    epoch.value = getSessionScope().epoch;
  });
  watch(() => [key(), enabled(), epoch.value], () => { void load(); }, { immediate: true });
  onScopeDispose(() => { disposed = true; revision++; controller?.abort(); stopSession(); });
  return { data, error, loading, refresh: () => load(true) };
}
