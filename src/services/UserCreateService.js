const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const UsersRepository = require("../repositories/UsersRepository");
const DiskStorange = require("../providers/DiskStorage");

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({ nome, email, senha, telefone, categoria }) {
    const checkUserExists = await this.userRepository.findByEmailOrPhone(
      email,
      telefone
    );

    if (checkUserExists) {
      if (checkUserExists.email === email) {
        throw new AppError("Este e-mail já está em uso.", 400);
      }
      throw new AppError("Este telefone já está em uso.", 400);
    }

    const hashedPassword = await hash(senha, 8);

    await this.userRepository.create({
      nome,
      email,
      senha: hashedPassword,
      telefone,
      categoria,
    });
  }

  async createGoogle({ nome, email, telefone, avatar, google_id }) {
    if (telefone) {
      const checkUserExists = await this.userRepository.findByEmailOrPhone(
        email,
        telefone
      );

      if (checkUserExists) {
        if (checkUserExists.email === email) {
          throw new AppError("Este e-mail já está em uso.", 400);
        }
        throw new AppError("Este telefone já está em uso.", 400);
      }
    } else {
      const checkUserExists = await this.userRepository.findByEmail(email);

      if (checkUserExists) {
        throw new AppError("Este e-mail já está em uso.", 400);
      }
    }

    await this.userRepository.createGoogle({
      nome,
      email,
      telefone,
      avatar,
      google_id,
    });
  }

  async delete({ id }) {
    await this.userRepository.delete(id);
  }

  async index() {
    const users = await this.userRepository.index();
    return users;
  }

  async show({ id }) {
    const user = await this.userRepository.show(id);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 400);
    }

    return user;
  }

  async update({
    user_id: id,
    nome,
    email,
    senha,
    senha_velha,
    telefone,
    categoria,
    descricao,
    bairro,
    cep,
  }) {
    const user = await this.userRepository.show(id);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 400);
    }

    if (email) {
      const checkEmailExists = await this.userRepository.findByEmail(email);

      if (checkEmailExists) {
        throw new AppError("Este e-mail já está em uso.", 400);
      }
    }

    if (telefone) {
      const checkPhoneExists = await this.userRepository.findByPhone(telefone);

      if (checkPhoneExists) {
        throw new AppError("Este telefone já está em uso.", 400);
      }
    }

    if (senha) {
      if (!senha_velha) {
        throw new AppError(
          "Você precisa informar a senha antiga para definir a nova senha.",
          400
        );
      }
      const checkOldPassword = await compare(senha_velha, user.senha);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga incorreta.", 400);
      }
      const hashedPassword = await hash(senha, 8);

      user.senha = hashedPassword;
    }

    user.nome = nome ?? user.nome;
    user.email = email ?? user.email;
    user.telefone = telefone ?? user.telefone;
    user.categoria = categoria ?? user.categoria;
    user.descricao = descricao ?? user.descricao;
    user.bairro = bairro ?? user.bairro;
    user.cep = cep ?? user.cep;
    user.data_atualizacao = new Date();

    await this.userRepository.update(id, user);
  }

  async updateAvatar({ user_id: id, avatar }) {
    const diskStorage = new DiskStorange();
    const user = await this.show({ id });

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatar);
    user.avatar = filename;
    user.data_atualizacao = new Date();

    await this.userRepository.update(id, user);

    return user;
  }
  async resetPassword(email, token, senha, confirmaSenha) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 400);
    }

    if (user.google_id) {
      throw new AppError("Usuário cadastrado com o Google.", 400);
    }

    if (user.senha !== token) {
      throw new AppError("Token inválido.", 400);
    }

    if (senha !== confirmaSenha) {
      throw new AppError("As senhas não conferem.", 400);
    }

    const hashedPassword = await hash(senha, 8);

    user.senha = hashedPassword;
    user.data_atualizacao = new Date();

    await this.userRepository.update(user.id, user);

    return user;
  }

  async recoveryPassword(email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 400);
    }

    if (user.google_id) {
      throw new AppError("Usuário cadastrado com o Google.", 400);
    }

    const resetLink = `https://adotajamarica.vercel.app/reset?email=${user.email}&token=${user.senha}`;

    return { resetLink };
  }
}

module.exports = new UserCreateService(UsersRepository);
