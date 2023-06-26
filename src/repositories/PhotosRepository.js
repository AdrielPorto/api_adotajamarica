const knex = require("../database");
const PHOTOS_TABLE = "fotos_pets";

class PhotosRepository {
  async create(pet_id, url) {
    const photo = await knex(PHOTOS_TABLE).insert({
      pet_id,
      url,
    });
    return photo;
  }

  async index() {
    const photos = await knex(PHOTOS_TABLE).select("*");
    return photos;
  }

  async show(pet_id) {
    const photo = await knex(PHOTOS_TABLE).where({ pet_id }).first();
    return photo;
  }

  async findByPet(pet_id) {
    const photos = await knex(PHOTOS_TABLE).where({ pet_id }).select("*");
    return photos;
  }

  async photoExists(id) {
    const photo = await knex(PHOTOS_TABLE).where({ id }).first();
    return photo;
  }

  async photoExistsByPet(pet_id, url) {
    const photo = await knex(PHOTOS_TABLE).where({ pet_id, url }).first();
    return photo;
  }

  async deleteByPetUrl(pet_id, url) {
    const photo = await knex(PHOTOS_TABLE).where({ pet_id, url }).delete();
    return photo;
  }
}

module.exports = new PhotosRepository();
