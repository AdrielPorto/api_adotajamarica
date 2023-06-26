const FavoriteCreateService = require("../services/FavoriteCreateService");

class FavoritesController {
  async create(request, response) {
    const { pet_id } = request.body;

    const usuario_id = request.user.id;

    await FavoriteCreateService.execute({ usuario_id, pet_id });

    return response.status(201).json({ message: "Favoritado com sucesso!" });
  }

  async index(request, response) {
    const usuario_id = request.user.id;

    const favorites = await FavoriteCreateService.index(usuario_id);
    return response.status(200).json(favorites);
  }

  async delete(request, response) {
    const usuario_id = request.user.id;
    const { id } = request.params;

    await FavoriteCreateService.delete({
      id,
      usuario_id,
    });

    return response.status(200).json({ message: "Desfavoritado com sucesso!" });
  }
}

module.exports = FavoritesController;
