import { Notify } from 'quasar';

const DEFAULT_ERROR_MESSAGE = 'Что-то пошло не так';
const ERROR_MESSAGE_MAP: Record<string, string> = {
  internal_server_error: 'Внутренняя ошибка сервера',
  'messages.internal_server_error': 'Внутренняя ошибка сервера',
};

type NotifyInput = {
  message?: string;
};

function normalizeMessage(message?: string) {
  if (!message) {
    return DEFAULT_ERROR_MESSAGE;
  }

  return ERROR_MESSAGE_MAP[message] || message;
}

function resolveErrorMessage(input?: unknown) {
  if (typeof input === 'string') {
    return normalizeMessage(input);
  }

  if (input instanceof Error) {
    return normalizeMessage(input.message);
  }

  if (typeof input === 'object' && input !== null && 'message' in input) {
    return normalizeMessage(typeof input.message === 'string' ? input.message : undefined);
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function notifyError(input?: string | NotifyInput | Error | unknown) {
  const message = resolveErrorMessage(input);

  Notify.create({
    message,
    color: 'negative',
    timeout: 2500,
  });
}

export function notifySuccess(message: string) {
  Notify.create({
    message,
    color: 'positive',
    timeout: 1200,
  });
}
