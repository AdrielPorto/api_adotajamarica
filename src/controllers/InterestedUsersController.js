const InterestedUsersService = require("../services/InterestedUsersService");

class InterestedUsersController {
  async create(request, response) {
    const { pet_id, dono_pet_id } = request.body;

    const interessado_id = request.user.id;

    const interessados = await InterestedUsersService.execute({
      interessado_id,
      pet_id,
      dono_pet_id,
    });

    return response.status(201).json(interessados);
  }
  async index(request, response) {
    const dono_pet_id = request.user.id;

    const interessados = await InterestedUsersService.index(dono_pet_id);
    return response.status(200).json(interessados);
  }

  async showUserInterested(request, response) {
    const dono_pet_id = request.user.id;

    const interessados = await InterestedUsersService.showUserInterested(
      dono_pet_id
    );

    return response.status(200).json(interessados);
  }

  async delete(request, response) {
    const { id } = request.params;

    await InterestedUsersService.delete({ id });

    return response
      .status(200)
      .json({ message: "Desinteressado com sucesso!" });
  }
  async update(request, response) {
    const { usuarios_interessados_id } = request.body;

    const id = usuarios_interessados_id;

    await InterestedUsersService.update(id);

    return response.status(200).json({ message: "Atualizado com sucesso!" });
  }

  async checkIfUserIsInterested(request, response) {
    const { pet_id } = request.params;

    const interessado_id = request.user.id;

    const interessados = await InterestedUsersService.checkIfUserIsInterested({
      interessado_id,
      pet_id,
    });

    return response.status(200).json(interessados);
  }
}

module.exports = InterestedUsersController;
