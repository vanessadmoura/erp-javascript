import { handleGetAccessToken } from "./auth";

const BASE_URL = '/api/v1';

export const useApi = async <TypeDataResponse> (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: object,
    withAuth: boolean = true
): Promise<{
    data?: TypeDataResponse,
    detail: string
}> => {
    const access_token = handleGetAccessToken();
    const normalizedEndpoint = endpoint.replace(/\/+$/, '');

    const headers: Record<string, string> = {};

    if (withAuth && access_token) {
        headers['Authorization'] = `Bearer ${access_token}`;
    }

    if (method !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }

    const requestUrl = new URL(`${BASE_URL}/${normalizedEndpoint}/`, window.location.origin);

    if (method === 'GET' && data) {
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                requestUrl.searchParams.set(key, String(value));
            }
        });
    }

    try {
        const response = await fetch(requestUrl.toString(), {
            method,
            headers,
            body: method !== 'GET' ? JSON.stringify(data ?? {}) : undefined
        });

        const responseBody = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                data: undefined,
                detail: responseBody?.detail || response.statusText || 'Request failed'
            };
        }

        return {
            data: responseBody,
            detail: ''
        };
    } catch (error) {
        return {
            data: undefined,
            detail: error instanceof Error ? error.message : 'Network error'
        };
    }
}
