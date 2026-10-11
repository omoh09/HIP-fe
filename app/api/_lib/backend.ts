import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';

export const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '');
export const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN;

export class BackendConfigurationError extends Error {}

export async function requireAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value;

  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  return token;
}

export function requireBackendConfig() {
  if (!API_BASE_URL) {
    throw new BackendConfigurationError('API_BASE_URL is not configured');
  }

  return API_BASE_URL;
}

export function backendHeaders(token: string, includeInternalToken = false) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  if (includeInternalToken) {
    if (!INTERNAL_API_TOKEN) {
      throw new BackendConfigurationError('INTERNAL_API_TOKEN is not configured');
    }
    headers['X-Internal-Token'] = INTERNAL_API_TOKEN;
  }

  return headers;
}

export function backendError(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
    return { message: 'You are not authenticated.', status: 401 };
  }

  if (error instanceof BackendConfigurationError) {
    return { message: 'The application is not configured correctly.', status: 500 };
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const data = axiosError.response?.data;
    const message =
      data?.detail ??
      data?.message ??
      data?.error ??
      fallback;

    return {
      message: typeof message === 'string' ? message : fallback,
      status: axiosError.response?.status ?? 502,
    };
  }

  return { message: fallback, status: 500 };
}

export async function backendRequest<T>(
  config: AxiosRequestConfig,
  options: { internal?: boolean } = {}
): Promise<T> {
  const baseUrl = requireBackendConfig();
  const token = await requireAuthToken();

  const response = await axios.request<T>({
    ...config,
    url: `${baseUrl}${config.url ?? ''}`,
    headers: {
      ...backendHeaders(token, options.internal),
      ...(config.headers ?? {}),
    },
    timeout: 20_000,
    validateStatus: () => true,
  });

  if (response.status < 200 || response.status >= 300) {
    const error = new AxiosError(
      `Backend request failed with status ${response.status}`,
      undefined,
      response.config,
      response.request,
      response
    );
    throw error;
  }

  return response.data;
}

export async function publicBackendRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const baseUrl = requireBackendConfig();

  const response = await axios.request<T>({
    ...config,
    url: `${baseUrl}${config.url ?? ''}`,
    headers: {
      Accept: 'application/json',
      ...(config.headers ?? {}),
    },
    timeout: 20_000,
    validateStatus: () => true,
  });

  if (response.status < 200 || response.status >= 300) {
    const error = new AxiosError(
      `Backend request failed with status ${response.status}`,
      undefined,
      response.config,
      response.request,
      response
    );
    throw error;
  }

  return response.data;
}
