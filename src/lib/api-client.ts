/**
 * API Client Utilities
 * Centralized API communication layer
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T = unknown> {
  data: T;
  error?: null;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Fetch wrapper with error handling and default configuration
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiErrorResponse;
      throw new ApiError(
        response.status,
        error.error?.code || 'UNKNOWN_ERROR',
        error.error?.message || 'An error occurred'
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'FETCH_ERROR', 'Failed to fetch data');
  }
}
