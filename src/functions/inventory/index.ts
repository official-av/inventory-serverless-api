import {postSchema, putSchema} from './schema';

export const inventory = {
	handler: `${__dirname.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}/handler.main`,
	events: [
		{ // get inventory
			http: {
				method: 'get',
				path: 'inventory',
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // get inventory details by id
			http: {
				method: 'get',
				path: 'inventory/{id}',
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // create inventory
			http: {
				method: 'post',
				path: 'inventory',
				request: {
					schema: {
						'application/json': postSchema
					}
				},
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // create inventories bulk
			http: {
				method: 'post',
				path: 'inventory/bulk',
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // update inventory
			http: {
				method: 'put',
				path: 'inventory',
				request: {
					schema: {
						'application/json': putSchema
					}
				},
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // update bulk inventories
			http: {
				method: 'put',
				path: 'inventory/bulk',
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // delete inventory
			http: {
				method: 'delete',
				path: 'inventory/{id}',
				request: {
					paths: {
						id: true
					}
				},
				authorizer: 'verifyToken',
				cors: true
			}
		},
		{ // delete inventory
			http: {
				method: 'delete',
				path: 'inventory/bulk',
				authorizer: 'verifyToken',
				cors: true
			}
		}
	]
}
