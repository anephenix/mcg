// Migration for the posts table
const tableName = 'posts';

exports.up = (knex) => {
	// Create the posts table
	return knex.schema.createTableIfNotExists(tableName, (table) => {
		table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
		table.timestamps(true, true);
	});
};

exports.down = (knex) => {
	// Drop the posts table
	return knex.schema.dropTableIfExists(tableName);
};
