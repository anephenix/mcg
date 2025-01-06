// Migration for the blog_posts table
const tableName = 'blog_posts';

exports.up = (knex) => {
	// Create the blog_posts table
	return knex.schema.createTableIfNotExists(tableName, (table) => {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
		table.timestamps(true, true);
	});
};

exports.down = (knex) => {
	// Drop the blog_posts table
	return knex.schema.dropTableIfExists(tableName);
};
