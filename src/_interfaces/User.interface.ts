export interface User {
	id?: number;
	fname: string;
	lname: string;
	email: string;
	password?: string;
	contact: string;
	createdAt?: string;
	admin?: boolean;
}
