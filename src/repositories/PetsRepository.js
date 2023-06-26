const knex = require("../database");
const PETS_TABLE = "pets";

class PetsRepository {
  async create({
    nome,
    descricao,
    especie,
    raca,
    faixa_etaria,
    genero,
    porte_fisico,
    vacinado,
    vermifugado,
    disponibilidade,
    castrado,
    bairro,
    cep,
    usuario_id,
  }) {
    const pet = await knex(PETS_TABLE)
      .insert({
        nome,
        descricao,
        especie,
        raca,
        faixa_etaria,
        genero,
        porte_fisico,
        vacinado,
        vermifugado,
        disponibilidade,
        castrado,
        bairro,
        cep,
        usuario_id,
      })
      .returning("*");

    return pet;
  }

  async index() {
    const pets = await knex(PETS_TABLE)
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) as fotos"))
      .leftJoin("fotos_pets", "pets.id", "=", "fotos_pets.pet_id")
      .groupBy("pets.id")
      .orderBy("pets.id", "desc");

    return pets;
  }

  async findByUserId(id) {
    const pets = await knex(PETS_TABLE)
      .where("usuario_id", id)
      .select("*")
      .orderBy("id", "desc");

    return pets;
  }

  async listAllPets() {
    const pets = await knex("pets")
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) as fotos"))
      .innerJoin("fotos_pets", "pets.id", "=", "fotos_pets.pet_id")
      .where("pets.disponibilidade", "=", true)
      .groupBy("pets.id");

    return pets;
  }

  async listAllPetsAvailable() {
    const pets = await knex("pets")
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) as fotos"))
      .innerJoin("fotos_pets", "pets.id", "=", "fotos_pets.pet_id")
      .where("pets.disponibilidade", true)
      .groupBy("pets.id");

    return pets;
  }

  async listAllPetsAvailableWithFilters({
    busca,
    ordenar,
    faixa_etaria,
    especie,
    genero,
    porte_fisico,
    vacinado,
    vermifugado,
    castrado,
  }) {
    const petsQuery = knex("pets")
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) as fotos"))
      .innerJoin("fotos_pets", "pets.id", "=", "fotos_pets.pet_id")
      .where("pets.disponibilidade", true);

    if (faixa_etaria) {
      if (Array.isArray(faixa_etaria)) {
        petsQuery.whereIn("pets.faixa_etaria", faixa_etaria);
      } else {
        petsQuery.where("pets.faixa_etaria", "ilike", `%${faixa_etaria}%`);
      }
    }

    if (especie) {
      if (Array.isArray(especie)) {
        petsQuery.whereIn("pets.especie", especie);
      } else {
        petsQuery.where("pets.especie", "ilike", `%${especie}%`);
      }
    }

    if (genero) {
      if (Array.isArray(genero)) {
        petsQuery.whereIn("pets.genero", genero);
      } else {
        petsQuery.where("pets.genero", "ilike", `%${genero}%`);
      }
    }

    if (porte_fisico) {
      if (Array.isArray(porte_fisico)) {
        petsQuery.whereIn("pets.porte_fisico", porte_fisico);
      } else {
        petsQuery.where("pets.porte_fisico", "ilike", `%${porte_fisico}%`);
      }
    }

    if (ordenar) {
      if (ordenar === "ASC") {
        petsQuery.orderBy("pets.nome", "asc");
      } else if (ordenar === "DESC") {
        petsQuery.orderBy("pets.nome", "desc");
      } else if (ordenar === "MAIS_ANTIGO") {
        petsQuery.orderBy("pets.data_criacao", "asc");
      } else if (ordenar === "MAIS_RECENTE") {
        petsQuery.orderBy("pets.data_criacao", "desc");
      }
    }

    if (busca) {
      petsQuery
        .where(function () {
          this.where("pets.nome", "ilike", `%${busca}%`)
            .orWhere("pets.bairro", "ilike", `%${busca}%`)
            .orWhere("pets.raca", "ilike", `%${busca}%`);
        })
        .groupBy("pets.id");
    }

    if (vacinado) {
      petsQuery.where("pets.vacinado", "=", vacinado);
    }

    if (vermifugado) {
      petsQuery.where("pets.vermifugado", "=", vermifugado);
    }

    if (castrado) {
      petsQuery.where("pets.castrado", "=", castrado);
    }

    const pets = await petsQuery.groupBy("pets.id");

    return pets;
  }

  async listRecentPets() {
    const pets = await knex("pets")
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) as fotos"))
      .innerJoin("fotos_pets", "pets.id", "=", "fotos_pets.pet_id")
      .where("pets.disponibilidade", "=", true)
      .groupBy("pets.id")
      .orderBy("pets.id", "desc")
      .limit(6);

    return pets;
  }

  async listUserPets(id) {
    const pets = await knex(PETS_TABLE)
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) AS fotos"))
      .leftJoin("fotos_pets", "pets.id", "fotos_pets.pet_id")
      .where("pets.usuario_id", id)
      .groupBy("pets.id")
      .orderBy("pets.id", "desc");

    return pets;
  }

  async listUserPetsAvailable(id) {
    const pets = await knex(PETS_TABLE)
      .select("pets.*", knex.raw("ARRAY_AGG(fotos_pets.url) AS fotos"))
      .leftJoin("fotos_pets", "pets.id", "fotos_pets.pet_id")
      .where("pets.usuario_id", id)
      .where("pets.disponibilidade", true)
      .groupBy("pets.id")
      .orderBy("pets.id", "desc");

    return pets;
  }

  async findById(id) {
    const pet = await knex(PETS_TABLE)
      .select(
        "pets.*",
        knex.raw("array_agg(fotos_pets.url) AS fotos"),
        "usuarios.avatar",
        "usuarios.nome as nome_usuario",
        "usuarios.email",
        "usuarios.telefone",
        "usuarios.categoria"
      )
      .from("pets")
      .leftJoin("fotos_pets", "pets.id", "=", "fotos_pets.pet_id")
      .leftJoin("usuarios", "pets.usuario_id", "=", "usuarios.id")
      .where("pets.id", id)
      .groupBy(
        "pets.id",
        "usuarios.avatar",
        "usuarios.nome",
        "usuarios.email",
        "usuarios.telefone",
        "usuarios.categoria"
      );

    return pet;
  }

  async showPet(id) {
    const pet = await knex(PETS_TABLE).where("id", id).first();

    return pet;
  }

  async update({ id, pet }) {
    const updatedPet = await knex(PETS_TABLE).where("id", id).update(pet);
    return updatedPet;
  }

  async delete(id) {
    const deletedPet = await knex(PETS_TABLE).where("id", id).del();
    return deletedPet;
  }
}

module.exports = new PetsRepository();
