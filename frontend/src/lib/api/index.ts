import { dev } from '$app/environment';
import type { ApiErrorResponse } from '$lib/types';
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

type ApiConfig = {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	data?: unknown;
	params?: unknown;
};

const axiosInstance: AxiosInstance = axios.create({
	baseURL: dev ? 'http://localhost:4000/api' : 'http://api.com',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
	}
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
		}

		const apiError: ApiErrorResponse = {
			message: 'An error occurred',
			status: error.response?.status || 500
		};

		if (error.response?.data) {
			const data = error.response.data as Record<string, unknown>;
			apiError.message = data.error as string;
			apiError.errors = data.errors as string[];
			apiError.field_errors = data.field_errors as Record<string, string>;
		}

		return Promise.reject(apiError);
	}
);

export async function api<TResponse>(config: ApiConfig): Promise<TResponse> {
	const { url, method, data, params } = config;

	try {
		const response = await axiosInstance.request<TResponse>({
			url,
			method,
			data,
			params
		});

		return response.data;
	} catch (error) {
		throw error as ApiErrorResponse;
	}
}
