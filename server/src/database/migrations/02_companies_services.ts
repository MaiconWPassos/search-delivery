import Knex from 'knex';
export async function up(knex: Knex) {
  return knex.schema.createTable('companies_services', (table) => {
    table.increments('id').primary();
    table
      .integer('company_id')
      .notNullable()
      .references('id')
      .inTable('supermarkets');
    table
      .integer('service_id')
      .notNullable()
      .references('id')
      .inTable('services');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('companies_services');
}
