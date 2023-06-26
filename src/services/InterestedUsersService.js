const AppError = require("../utils/AppError");
const UsersRepository = require("../repositories/UsersRepository");
const PetsRepository = require("../repositories/PetsRepository");
const InterestedUsersRepository = require("../repositories/InterestedUsersRepository");

class InterestedUsersService {
  constructor() {
    this.user = UsersRepository;
    this.pet = PetsRepository;
    this.interestedUsers = InterestedUsersRepository;
  }

  async execute({ interessado_id, pet_id, dono_pet_id }) {
    const dono_pet = await this.user.show(dono_pet_id);
    if (!dono_pet) {
      throw new AppError("Este usuário não existe.", 400);
    }

    const pet = await this.pet.findById(pet_id);

    if (!pet) {
      throw new AppError("Este pet não existe.", 400);
    }

    if (pet.dono_pet_id === interessado_id) {
      throw new AppError("Você não pode se interessar pelo seu próprio pet.");
    }

    const ifIsInterested = await this.interestedUsers.checkIfUserIsInterested({
      interessado_id,
      pet_id,
    });

    if (ifIsInterested) {
      throw new AppError("Você já se interessou por este pet.");
    }

    const interessado = await this.interestedUsers.create({
      interessado_id,
      pet_id,
      dono_pet_id,
    });

    return interessado;
  }

  async index(dono_pet_id) {
    const interessados = await this.interestedUsers.index(dono_pet_id);

    return interessados;
  }

  async delete({ id }) {
    const interestedUser = await this.interestedUsers.findById(id);

    if (!interestedUser) {
      throw new AppError("Este usuário não existe.", 400);
    }

    await this.interestedUsers.delete(id);

    return;
  }

  async update(id) {
    const interestedUser = await this.interestedUsers.findById(id);

    if (!interestedUser) {
      throw new AppError("Este usuário não existe.", 400);
    }
    const interessados = await this.interestedUsers.update(id);

    if (interessados) {
      await this.interestedUsers.deleteAllAdoptedPets(interessados[0].pet_id);

      const pet = await this.pet.showPet(interessados[0].pet_id);

      if (pet) {
        pet.disponibilidade = false;

        await this.pet.update({
          id: interessados[0].pet_id,
          pet,
        });
      }
    }

    return;
  }

  async checkIfUserIsInterested({ interessado_id, pet_id }) {
    const interessados = await this.interestedUsers.checkIfUserIsInterested({
      interessado_id,
      pet_id,
    });

    return interessados;
  }
}

module.exports = new InterestedUsersService();
