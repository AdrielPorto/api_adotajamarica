const { validationResult } = require("express-validator");
const petValidations = require("../validations/petValidations");

const PetCreateService = require("../services/PetCreateService");

class PetsController {
  async create(request, response) {
    const {
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
    } = request.body;

    const usuario_id = request.user.id;

    if (!usuario_id) {
      return response.status(400).json({ error: "Usuário não encontrado" });
    }

    await Promise.all(
      petValidations.map((validation) => validation.run(request))
    );

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const pet = await PetCreateService.execute({
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

    return response.status(201).json(pet);
  }
  async index(request, response) {
    const { user_id } = request.query;

    if (user_id) {
      const pets = await PetCreateService.findByUser(user_id);
      return response.status(200).json(pets);
    }

    const pets = await PetCreateService.index();

    return response.status(200).json(pets);
  }
  async show(request, response) {
    const { id } = request.params;

    const pet = await PetCreateService.show(id);

    return response.status(200).json(pet);
  }

  async listAllPets(request, response) {
    const pets = await PetCreateService.listAllPets();

    return response.status(200).json(pets);
  }

  async listAllPetsAvailable(request, response) {
    if (request.query) {
      const {
        busca,
        ordenar,
        faixa_etaria,
        especie,
        raca,
        bairro,
        genero,
        porte_fisico,
        caracteristica,
      } = request.query;

      const pets = await PetCreateService.listAllPetsAvailableWithFilters(
        busca,
        ordenar,
        faixa_etaria,
        especie,
        raca,
        bairro,
        genero,
        porte_fisico,
        caracteristica
      );

      return response.status(200).json(pets);
    }

    const pets = await PetCreateService.listAllPetsAvailable();

    return response.status(200).json(pets);
  }

  async listRecentPets(request, response) {
    const pets = await PetCreateService.listRecentPets();

    return response.status(200).json(pets);
  }

  async listUserPets(request, response) {
    const { id } = request.params;

    const pets = await PetCreateService.listUserPets(id);

    response.status(200).json(pets);
  }

  async listUserPetsAvailable(request, response) {
    const { id } = request.params;

    const pets = await PetCreateService.listUserPetsAvailable(id);

    response.status(200).json(pets);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
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
    } = request.body;

    await PetCreateService.update({
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
    });

    return response
      .status(200)
      .json({ message: "Pet atualizado com sucesso!" });
  }

  async delete(request, response) {
    const { id } = request.params;

    await PetCreateService.delete(id);

    response.status(200).json({ message: "Pet deletado com sucesso!" });
  }
}

module.exports = PetsController;
