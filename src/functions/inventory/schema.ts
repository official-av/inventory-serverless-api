export const postSchema = {
	type: "object",
	properties: {
		inv_name: {type: 'string'},
		price: {type: 'number'},
		weight: {type: 'string'}
	},
	required: ['name', 'price', 'weight']
};

export const putSchema = {
	type: "object",
	properties: {
		id: {type: 'number'},
		name: {type: 'string'},
		price: {type: 'number'},
		weight: {type: 'string'}
	},
	required: ['id']
};
