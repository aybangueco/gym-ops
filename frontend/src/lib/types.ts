export type ApiErrorResponse = {
	message: string;
	status: number;
	errors?: string[];
	field_errors?: Record<string, string>;
};

export type AuthResponse = {
	token: string;
};

export type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	activated: boolean;
	created_at: Date;
	updated_at: Date;
	version: number;
};

export type AuthenticatedResponse = {
	user: User;
};
