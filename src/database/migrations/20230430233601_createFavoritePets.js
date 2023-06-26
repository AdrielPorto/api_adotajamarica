exports.up = (knex) =>
  knex.schema.createTable("favoritos", (table) => {
    table.increments("id").primary();
    table.integer("usuario_id").unsigned().notNullable();
    table
      .foreign("usuario_id")
      .references("id")
      .inTable("usuarios")
      .onDelete("CASCADE");
    table.integer("pet_id").unsigned().notNullable();
    table
      .foreign("pet_id")
      .references("id")
      .inTable("pets")
      .onDelete("CASCADE");
    table.timestamp("data_criacao").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("favoritos");
