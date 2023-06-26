exports.up = (knex) =>
  knex.schema.createTable("pets", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("descricao");
    table.string("especie").notNullable();
    table.string("raca").notNullable();
    table.string("faixa_etaria").notNullable();
    table.string("genero").notNullable();
    table.string("porte_fisico").notNullable();
    table.boolean("vacinado").notNullable().defaultTo(false);
    table.boolean("vermifugado").notNullable().defaultTo(false);
    table.boolean("disponibilidade").notNullable().defaultTo(true);
    table.boolean("castrado").notNullable().defaultTo(false);
    table.string("bairro").notNullable();
    table.string("cep").notNullable();
    table.integer("usuario_id").unsigned().notNullable();
    table
      .foreign("usuario_id")
      .references("id")
      .inTable("usuarios")
      .onDelete("CASCADE");
    table.timestamp("data_criacao").defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("pets");
