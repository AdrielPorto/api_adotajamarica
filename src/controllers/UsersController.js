const { validationResult } = require("express-validator");
const userValidations = require("../validations/userValidations");

const UserCreateService = require("../services/UserCreateService");

class UsersController {
  async create(request, response) {
    const { nome, email, senha, confirmaSenha, telefone, categoria } =
      request.body;

    await Promise.all(
      userValidations.map((validation) => validation.run(request))
    );

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    if (senha !== confirmaSenha) {
      return response
        .status(400)
        .json({ errors: [{ msg: "Senhas não conferem" }] });
    }

    await UserCreateService.execute({
      nome,
      email,
      senha,
      telefone,
      categoria,
    });

    return response
      .status(201)
      .json({ message: "Usuário criado com sucesso!" });
  }

  async createGoogle(request, response) {
    const { nome, email, telefone, avatar, google_id } = request.body;

    await UserCreateService.createGoogle({
      nome,
      email,
      telefone,
      avatar,
      google_id,
    });

    return response
      .status(201)
      .json({ message: "Usuário criado com sucesso!" });
  }

  async index(request, response) {
    const users = await UserCreateService.index();

    return response.status(200).json(users);
  }

  async show(request, response) {
    const { id } = request.params;

    const user = await UserCreateService.show({ id });

    return response.status(200).json(user);
  }

  async delete(request, response) {
    const user_id = request.user.id;

    await UserCreateService.delete({ id: user_id });

    return response
      .status(200)
      .json({ message: "Usuário deletado com sucesso!" });
  }

  async update(request, response) {
    const user_id = request.user.id;
    const {
      nome,
      email,
      senha,
      senha_velha,
      telefone,
      categoria,
      descricao,
      bairro,
      cep,
    } = request.body;

    await UserCreateService.update({
      user_id,
      nome,
      email,
      senha,
      senha_velha,
      telefone,
      categoria,
      descricao,
      bairro,
      cep,
    });

    return response
      .status(200)
      .json({ message: "Usuário atualizado com sucesso!" });
  }

  async updateAvatar(request, response) {
    const user_id = request.user.id;
    const avatar = request.file.filename;

    const user = await UserCreateService.updateAvatar({ user_id, avatar });

    return response.status(200).json(user);
  }

  async resetPassword(request, response) {
    const { email, token, senha, confirmaSenha } = request.body;

    if (senha !== confirmaSenha) {
      return response
        .status(400)
        .json({ errors: [{ msg: "Senhas não conferem" }] });
    }

    await UserCreateService.resetPassword(email, token, senha, confirmaSenha);

    return response.status(200).json({ message: "Email enviado com sucesso!" });
  }

  async recoveryPassword(request, response) {
    const { email } = request.body;

    const resetLink = await UserCreateService.recoveryPassword(email);

    return response.status(200).json(resetLink);
  }
}

module.exports = UsersController;
