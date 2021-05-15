export const postSchema = {
	type: "object",
	properties: {
		fname: {type: 'string'},
		lname: {type: 'string'},
		email: {type: 'string'},
		password: {type: 'string'},
		contact: {type: 'string'}
	},
	required: ['fname', 'lname', 'email', 'password', 'contact']
}
