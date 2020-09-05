// Dependencies
const { Model } = require('objection');

class Post extends Model {
	/* Always define the table in the db that the model refers to */
	static get tableName() {
		return 'blog_posts';
	}

	// Assume timestamps are always present
	/* This runs sets timestamps before a record is inserted into the database */
	async $beforeInsert(queryContext) {
		await super.$beforeInsert(queryContext);
		const date = new Date().toISOString();
		this.created_at = date;
		this.updated_at = date;
	}

	/* This runs updates a timestamp before a record is updated in the database */
	async $beforeUpdate(queryContext) {
		await super.$beforeUpdate(queryContext);
		this.updated_at = new Date().toISOString();
	}

	/* This defines the data schema for the model */
	static get jsonSchema() {
		return {
			type: 'object',
			required: [],
			properties: {
				id: { type: 'string', readOnly: true },
				created_at: {
					type: 'string',
					format: 'date-time',
					readOnly: true,
				},
				updated_at: { type: 'string', format: 'date-time' },
			},
		};
	}
}

module.exports = Post;
