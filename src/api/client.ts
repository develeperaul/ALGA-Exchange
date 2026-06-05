import ky, { HTTPError } from 'ky';
import { notifyError } from '@/utils/notify';
import { getStoredToken } from '@/utils/auth-token';

const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так';
const ERROR_CODE_MESSAGES: Record<string, string> = {
  internal_server_error: 'Внутренняя ошибка сервера',
};

type ApiErrorPayload = {
  message?: string;
  errors?: Array<{
    code?: string;
    message?: string;
  }> | Record<string, string[] | string>;
};

function normalizeMessageValue(message?: string) {
  if (!message) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (message.startsWith('messages.')) {
    const code = message.replace('messages.', '');
    return ERROR_CODE_MESSAGES[message] || ERROR_CODE_MESSAGES[code] || message;
  }

  return ERROR_CODE_MESSAGES[message] || message;
}

function normalizeErrorMessage(payload?: ApiErrorPayload) {
  if (!payload) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (payload.message) {
    return normalizeMessageValue(payload.message);
  }

  if (payload.errors) {
    if (Array.isArray(payload.errors)) {
      const firstError = payload.errors.find((error) => error.message || error.code);

      if (firstError?.message) {
        return normalizeMessageValue(firstError.message);
      }

      if (firstError?.code) {
        return ERROR_CODE_MESSAGES[firstError.code] || firstError.code;
      }
    }

    for (const value of Object.values(payload.errors)) {
      if (Array.isArray(value) && value.length > 0) {
        return value[0] || DEFAULT_ERROR_MESSAGE;
      }

      if (typeof value === 'string' && value) {
        return value;
      }
    }
  }

  return DEFAULT_ERROR_MESSAGE;
}

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        if (request.url.includes('/api/auth/')) {
          request.headers.delete('Authorization');
          return;
        }

        const token = getStoredToken();

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        } else {
          request.headers.delete('Authorization');
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status < 400) {
          return response;
        }

        let payload: ApiErrorPayload | undefined;

        try {
          payload = await response.clone().json<ApiErrorPayload>();
        } catch {
          payload = undefined;
        }

        notifyError(normalizeErrorMessage(payload));

        return response;
      },
    ],
    beforeError: [
      async (error) => {
        if (error instanceof HTTPError) {
          try {
            const payload = await error.response.clone().json<ApiErrorPayload>();

            error.message = normalizeErrorMessage(payload);
          } catch {
            error.message = DEFAULT_ERROR_MESSAGE;
          }

          return error;
        }

        notifyError(DEFAULT_ERROR_MESSAGE);
        error.message = DEFAULT_ERROR_MESSAGE;

        return error;
      },
    ],
  },
});
