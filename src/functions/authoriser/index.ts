import {registerSchema} from "./schema";

export const register = {
	handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.register`,
	events: [
		{
			http: { // create user and register
				path: 'register',
				method: 'post',
				cors: true,
				request: {
					schema: {
						'application/json': registerSchema
					}
				}
			}
		}
	]
}

export const login = {
	handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.login`,
	events: [
		{
			http: { // fetch and return jwt
				path: 'login',
				method: 'post',
				cors: true
			}
		}
	]
}

export const verifyToken = {
	handler:`${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.verifyToken`
}
