const PhotosCreateService = require("../services/PhotoCreateService");
const AppError = require("../utils/AppError");

class PhotosController {
  async create(request, response) {
    const { id: pet_id } = request.params;
    const photos = request.files;

    if (!request.files) {
      throw new AppError("Fotos não enviadas!", 400);
    }

    await PhotosCreateService.execute(photos, pet_id);

    response.status(201).json({ message: "Fotos criadas com sucesso!" });
  }

  async index(request, response) {
    const photos = await PhotosCreateService.index();

    return response.status(200).json(photos);
  }
  async show(request, response) {
    const { pet_id } = request.params;

    const photo = await PhotosCreateService.show(pet_id);
    return response.status(200).json(photo);
  }

  async findByPet(request, response) {
    const { pet_id } = request.params;

    const photos = await PhotosCreateService.findByPet(pet_id);
    return response.status(200).json(photos);
  }

  async deleteByPetUrl(request, response) {
    const { pet_id, url } = request.body;

    await PhotosCreateService.deleteByPetUrl(pet_id, url);

    return response.status(200).json({ message: "Foto deletada com sucesso!" });
  }
}

module.exports = PhotosController;
