export type ApiErrorResponse = {
	message: string;
	status: number;
	errors?: string[];
	field_errors?: Record<string, string>;
};

export type AuthResponse = {
	token: string;
};
