exports.up = (knex) =>
  knex.schema.createTable("fotos_pets", (table) => {
    table.increments("id").primary();
    table.integer("pet_id").unsigned().notNullable();
    table
      .foreign("pet_id")
      .references("id")
      .inTable("pets")
      .onDelete("CASCADE");
    table.string("url").notNullable();
    table.timestamp("data_criacao").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("fotos_pets");
