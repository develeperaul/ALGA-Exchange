import ky, { type Options } from 'ky';
import { apiBaseUrl } from './config';
import { clearSession, getSessionScope, isCurrentSession, isValidSession } from './session';
import { invalidResponse, normalizeApiError } from './errors';

const transport = ky.create({
  timeout: 15000,
  credentials: 'omit',
  headers: { Accept: 'application/json' },
  retry: { limit: 1, methods: ['get'], statusCodes: [408, 429, 500, 502, 503, 504] },
});
export const apiClient = transport.extend({
  hooks: {
    beforeRequest: [(request, options) => {
      const previous = options.context.algaSessionScope as ReturnType<typeof getSessionScope> | undefined;
      if (previous && (!isCurrentSession(previous.epoch) || previous.signal.aborted)) throw new DOMException('Запрос отменён', 'AbortError');
      const scope = previous || getSessionScope();
      if (scope.session && !isValidSession(scope.session)) clearSession(scope.epoch);
      const current = getSessionScope();
      options.context.algaSessionScope = current;
      request.headers.delete('Authorization');
      if (current.session) request.headers.set('Authorization', `Bearer ${current.session.token}`);
      const combined = new AbortController();
      for (const signal of [request.signal, current.signal]) {
        if (signal.aborted) combined.abort();
        else signal.addEventListener('abort', () => combined.abort(), { once: true, signal: combined.signal });
      }
      const scopedRequest = new Request(request, { signal: combined.signal });
      return scopedRequest;
    }],
    afterResponse: [(_request, options, response) => {
      const epoch = (options.context.algaSessionScope as ReturnType<typeof getSessionScope> | undefined)?.epoch;
      if (response.status === 401 && epoch !== undefined && isCurrentSession(epoch)) clearSession(epoch);
    }],
  },
});

/** Keeps JSON:API data/attributes intact; public requests never carry a bearer. */
export async function requestJson<T>(path: string, options: Options = {}, authenticated = false): Promise<T> {
  try {
    const response = await (authenticated ? apiClient : transport)(`${apiBaseUrl}/${path.replace(/^\/+/, '')}`, options);
    try { return await response.json<T>(); } catch { throw invalidResponse(); }
  } catch (error) { throw await normalizeApiError(error); }
}
