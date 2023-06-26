exports.up = (knex) =>
  knex.schema.createTable("usuarios_interessados", (table) => {
    table.increments("id").primary();
    table.integer("interessado_id").unsigned().notNullable();
    table.integer("pet_id").unsigned().notNullable();
    table.integer("dono_pet_id").unsigned().notNullable();
    table.boolean("adotado").notNullable().defaultTo(false);
    table.timestamp("data_criacao").defaultTo(knex.fn.now());
    table
      .foreign("interessado_id")
      .references("id")
      .inTable("usuarios")
      .onDelete("CASCADE");
    table
      .foreign("pet_id")
      .references("id")
      .inTable("pets")
      .onDelete("CASCADE");
    table
      .foreign("dono_pet_id")
      .references("id")
      .inTable("usuarios")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("usuarios_interessados");
