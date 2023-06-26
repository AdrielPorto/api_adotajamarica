const knex = require("../database");
const FAVORITES_TABLE = "favoritos";
const PETS_TABLE = "pets";

class FavoritesRepository {
  async create({ pet_id, usuario_id }) {
    const favorite = await knex(FAVORITES_TABLE).insert({
      pet_id,
      usuario_id,
    });
    return favorite;
  }

  async index(usuario_id) {
    const petsFavoritos = await knex(PETS_TABLE)
      .select(
        "pets.*",
        knex.raw(
          "(SELECT ARRAY_AGG(fotos_pets.url) FROM fotos_pets WHERE fotos_pets.pet_id = pets.id) AS fotos"
        )
      )
      .leftJoin("favoritos", "pets.id", "favoritos.pet_id")
      .whereIn("favoritos.pet_id", function () {
        this.select("pet_id").from("favoritos").where("usuario_id", usuario_id);
      })
      .groupBy("pets.id")
      .orderBy(knex.raw("MAX(favoritos.data_criacao)"), "desc");

    return petsFavoritos;
  }

  async delete({ id, usuario_id }) {
    const pet_id = id;

    const deleteFavorite = await knex(FAVORITES_TABLE)
      .where({
        pet_id,
        usuario_id,
      })
      .del();

    return deleteFavorite;
  }

  async findByPetAndUser(usuario_id, pet_id) {
    const favorite = await knex(FAVORITES_TABLE).where({
      usuario_id,
      pet_id,
    });

    return favorite;
  }

  async checkThePetBelongsToTheUser(usuario_id, pet_id) {
    const pet = await knex(PETS_TABLE).where({
      usuario_id,
      id: pet_id,
    });

    return pet;
  }
}

module.exports = new FavoritesRepository();
