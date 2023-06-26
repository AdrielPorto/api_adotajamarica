const AppError = require("../utils/AppError");
const PhotosRepository = require("../repositories/PhotosRepository");
const DiskStorange = require("../providers/DiskStorage");

class PhotoCreateService {
  constructor(photosRepository) {
    this.photosRepository = photosRepository;
  }

  async execute(photos, pet_id) {
    if (!photos || pet_id === undefined) {
      throw new AppError("Erro ao criar fotos");
    }

    const diskStorage = new DiskStorange();

    try {
      await Promise.all(
        photos.map(async (photo) => {
          const { filename } = photo;
          const file = await diskStorage.saveFile(filename);

          await this.photosRepository.create(pet_id, file);
        })
      );
    } catch (err) {
      console.log(err);
    }
  }

  async show(pet_id) {
    const photo = await this.photosRepository.show(pet_id);

    if (!photo) {
      throw new AppError("Erro ao mostrar foto");
    }

    return photo;
  }

  async index() {
    const photos = await this.photosRepository.index();
    return photos;
  }

  async findByPet(pet_id) {
    const photos = await this.photosRepository.findByPet(pet_id);

    if (!photos) {
      throw new AppError("Erro ao mostrar fotos");
    }

    return photos;
  }

  async deleteByPetUrl(pet_id, url) {
    const diskStorage = new DiskStorange();

    const petsPhotos = await this.photosRepository.photoExistsByPet(
      pet_id,
      url
    );

    if (petsPhotos) {
      await diskStorage.deleteFile(petsPhotos.url);
    }

    const photo = await this.photosRepository.deleteByPetUrl(pet_id, url);

    if (!photo) {
      throw new AppError("Erro ao deletar foto");
    }
  }
}

module.exports = new PhotoCreateService(PhotosRepository);
