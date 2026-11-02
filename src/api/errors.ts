import { HTTPError, TimeoutError } from 'ky';

export interface ApiErrorItem { code: string; message: string }
export class ApiError extends Error {
  constructor(message: string, public status: number | null = null,
    public code = 'request_failed', public errors: ApiErrorItem[] = [],
    public retryAfter: string | null = null) {
    super(message);
    this.name = 'ApiError';
  }
}
export function invalidResponse() {
  return new ApiError('Сервер вернул некорректный ответ', null, 'invalid_response');
}
export async function normalizeApiError(error: unknown): Promise<Error> {
  if (error instanceof ApiError) return error;
  if (error instanceof HTTPError) {
    const body: unknown = await error.response.clone().json().catch(() => null);
    const items = (body && typeof body === 'object' && 'errors' in body && Array.isArray(body.errors))
      ? body.errors.filter((item): item is ApiErrorItem => Boolean(item && typeof item.code === 'string' && typeof item.message === 'string')) : [];
    return new ApiError(items.map(item => item.message).join('\n') || `Не удалось выполнить запрос (${error.response.status})`,
      error.response.status, items[0]?.code || 'http_error', items, error.response.headers.get('Retry-After'));
  }
  if (error instanceof Error && error.name === 'AbortError') return error;
  return new ApiError(error instanceof TimeoutError ? 'Сервер не ответил вовремя. Повторите попытку.' : 'Не удалось связаться с сервером. Повторите попытку.', null, 'network_error');
}
