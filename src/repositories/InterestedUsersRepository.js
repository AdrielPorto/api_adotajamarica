const knex = require("../database");
const FAVORITES_TABLE = "favoritos";
const PETS_TABLE = "pets";
const INTERESTED_USERS_TABLE = "usuarios_interessados";

class InterestedUsersRepository {
  async create({ interessado_id, pet_id, dono_pet_id }) {
    const interessado = await knex(INTERESTED_USERS_TABLE)
      .insert({
        interessado_id,
        pet_id,
        dono_pet_id,
      })
      .returning("*");

    return interessado;
  }

  async checkIfUserIsInterested({ interessado_id, pet_id }) {
    const interessado = await knex(INTERESTED_USERS_TABLE)
      .where({ interessado_id, pet_id })
      .first();

    return interessado;
  }

  async index(dono_pet_id) {
    const interessados = await knex
      .select(
        "p.id as pet_id",
        "p.nome as pet_nome",
        knex.raw("ARRAY_AGG(fp.url) as foto_pet_url"),
        "ui.id as usuarios_interessados_id",
        "u.nome as usuario_nome",
        "u.id as usuario_id",
        "u.avatar as usuario_avatar",
        "u.email as usuario_email",
        "u.telefone as usuario_telefone"
      )
      .from("usuarios_interessados as ui")
      .innerJoin("pets as p", "ui.pet_id", "p.id")
      .innerJoin("fotos_pets as fp", "p.id", "fp.pet_id")
      .innerJoin("usuarios as u", "ui.interessado_id", "u.id")
      .where("ui.dono_pet_id", dono_pet_id)
      .where("ui.adotado", false)
      .groupBy("p.id", "ui.id", "u.id")
      .orderBy("ui.data_criacao", "desc");

    return interessados;
  }

  async findById(id) {
    const interessado = await knex(INTERESTED_USERS_TABLE)
      .where({ id })
      .first();

    return interessado;
  }

  async delete(id) {
    await knex(INTERESTED_USERS_TABLE).where({ id }).del();

    return;
  }

  async update(id) {
    const interessados = await knex(INTERESTED_USERS_TABLE)
      .where({ id })
      .update({ adotado: true })
      .returning("*");

    return interessados;
  }

  async deleteAllAdoptedPets(pet_id) {
    await knex(INTERESTED_USERS_TABLE)
      .where({ pet_id: pet_id, adotado: false })
      .del();

    return;
  }

  async checkIfUserIsInterested({ interessado_id, pet_id }) {
    const interessado = await knex(INTERESTED_USERS_TABLE)
      .where({ interessado_id, pet_id })
      .first();

    return interessado;
  }
}

module.exports = new InterestedUsersRepository();
