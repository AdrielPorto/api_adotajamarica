const AppError = require("../utils/AppError");
const FavoritesRepository = require("../repositories/FavoritesRepository");

class FavoriteCreateService {
  constructor(favoritesRepository) {
    this.favoritesRepository = favoritesRepository;
  }

  async execute({ usuario_id, pet_id }) {
    const checkThePetBelongsToTheUser =
      await this.favoritesRepository.checkThePetBelongsToTheUser(
        usuario_id,
        pet_id
      );

    if (
      Array.isArray(checkThePetBelongsToTheUser) &&
      checkThePetBelongsToTheUser.length > 0
    ) {
      throw new AppError("Você não pode favoritar seu próprio pet.", 400);
    }

    const checkFavoriteExists = await this.favoritesRepository.findByPetAndUser(
      usuario_id,
      pet_id
    );

    if (Array.isArray(checkFavoriteExists) && checkFavoriteExists.length > 0) {
      throw new AppError("Este favorito já existe.", 400);
    }

    await this.favoritesRepository.create({
      usuario_id,
      pet_id,
    });
  }

  async delete({ id, usuario_id }) {
    await this.favoritesRepository.delete({
      id,
      usuario_id,
    });
  }

  async index(usuario_id) {
    const favorites = await this.favoritesRepository.index(usuario_id);
    return favorites;
  }
}

module.exports = new FavoriteCreateService(FavoritesRepository);
