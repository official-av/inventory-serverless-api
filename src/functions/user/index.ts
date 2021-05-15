export const user = {
	handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.main`,
	events: [
		{ // get users
			http: {
				method: 'get',
				path: 'user',
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // get user details by id
			http: {
				method: 'get',
				path: 'user/{id}',
				authorizer: 'verifyToken',
				cors: true
			}
		},
		/*{ // create user
			http: {
				method: 'post',
				path: 'user',
				request: {
					schema: {
						'application/json': postSchema
					}
				},
				cors: true
			}
		},*/
		/*{ // update user
			http: {
				method: 'put',
				path: 'inventory',
				request: {
					schema: {
						'application/json': putSchema
					}
				},
				cors: true
			}
		},*/
		/*{ // delete user
			http: {
				method: 'delete',
				path: 'inventory/{id}',
				request: {
					paths: {
						id: true
					}
				},
				cors: true
			}
		}*/
	]
}
