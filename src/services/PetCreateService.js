const AppError = require("../utils/AppError");
const PetsRepository = require("../repositories/PetsRepository");

class PetCreateService {
  constructor(petsRepository) {
    this.petsRepository = petsRepository;
  }

  async execute({
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
    const response = await this.petsRepository.create({
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
    });

    if (!response) {
      throw new AppError("Erro ao cadastrar pet", 400);
    }

    return response;
  }

  async index() {
    const pets = await this.petsRepository.index();
    return pets;
  }

  async show(id) {
    const pet = await this.petsRepository.findById(id);
    return pet;
  }

  async findByUser(id) {
    const pets = await this.petsRepository.findByUserId(id);
    return pets;
  }

  async listAllPets() {
    const pets = await this.petsRepository.listAllPets();
    return pets;
  }

  async listAllPetsAvailable() {
    const pets = await this.petsRepository.listAllPetsAvailable();
    return pets;
  }

  async listRecentPets() {
    const pets = await this.petsRepository.listRecentPets();
    return pets;
  }
  async listAllPetsAvailableWithFilters(
    busca,
    ordenar,
    faixa_etaria,
    especie,
    raca,
    bairro,
    genero,
    porte_fisico,
    caracteristica
  ) {
    let vacinado,
      vermifugado,
      castrado = false;
    if (typeof caracteristica === "string") {
      if (caracteristica.includes("Vacinado")) {
        vacinado = true;
      }
      if (caracteristica.includes("Vermifugado")) {
        vermifugado = true;
      }

      if (caracteristica.includes("Castrado")) {
        castrado = true;
      }
    }

    if (typeof caracteristica === "object") {
      Array.from(caracteristica).forEach((caracteristica) => {
        if (caracteristica.includes("Vacinado")) {
          vacinado = true;
        }
        if (caracteristica.includes("Vermifugado")) {
          vermifugado = true;
        }

        if (caracteristica.includes("Castrado")) {
          castrado = true;
        }
      });
    }

    const pets = await this.petsRepository.listAllPetsAvailableWithFilters({
      busca,
      ordenar,
      faixa_etaria,
      especie,
      raca,
      bairro,
      genero,
      porte_fisico,
      vacinado,
      vermifugado,
      castrado,
    });
    return pets;
  }

  async listUserPets(id) {
    const pets = await this.petsRepository.listUserPets(id);
    return pets;
  }

  async listUserPetsAvailable(id) {
    const pets = await this.petsRepository.listUserPetsAvailable(id);
    return pets;
  }

  async update({
    id,
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
  }) {
    const pet = await this.petsRepository.findById(id);

    if (!pet) {
      throw new AppError("Pet não encontrado", 404);
    }

    const updatedPet = await this.petsRepository.update({
      id,
      pet: {
        nome: nome || pet.nome,
        descricao: descricao || pet.descricao,
        especie: especie || pet.especie,
        raca: raca || pet.raca,
        faixa_etaria: faixa_etaria || pet.faixa_etaria,
        genero: genero || pet.genero,
        porte_fisico: porte_fisico || pet.porte_fisico,
        vacinado: vacinado || pet.vacinado,
        vermifugado: vermifugado || pet.vermifugado,
        disponibilidade: disponibilidade || pet.disponibilidade,
        castrado: castrado || pet.castrado,
        bairro: bairro || pet.bairro,
        cep: cep || pet.cep,
      },
    });

    return updatedPet;
  }

  async delete(id) {
    const pet = await this.petsRepository.findById(id);

    if (!pet) {
      throw new AppError("Pet não encontrado", 404);
    }

    await this.petsRepository.delete(id);
  }
}

module.exports = new PetCreateService(PetsRepository);
