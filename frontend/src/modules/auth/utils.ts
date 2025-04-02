import { invalidate } from '$app/navigation';

const TOKEN_KEY = 'token';

export const getToken = () => {
	return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
	return localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
	return localStorage.removeItem(TOKEN_KEY);
};

export const clearLocalStorage = () => {
	return localStorage.clear();
};

export const logOut = () => {
	removeToken();
	invalidate('auth:me');
};
