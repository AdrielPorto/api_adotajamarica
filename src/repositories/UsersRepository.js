const knex = require("../database");
const USERS_TABLE = "usuarios";

class UsersRepository {
  async findByEmailOrPhone(email, telefone) {
    const user = await knex(USERS_TABLE)
      .where({ email })
      .orWhere({ telefone })
      .first();
    return user;
  }

  async findByEmail(email) {
    const user = await knex(USERS_TABLE).where({ email }).first();
    return user;
  }

  async findByPhone(telefone) {
    const user = await knex(USERS_TABLE).where({ telefone }).first();
    return user;
  }

  async create({ nome, email, senha, telefone, categoria }) {
    const user = await knex(USERS_TABLE).insert({
      nome,
      email,
      senha,
      telefone,
      categoria,
    });
    return user;
  }

  async createGoogle({ nome, email, telefone, avatar, google_id }) {
    const user = await knex(USERS_TABLE).insert({
      nome,
      email,
      telefone,
      avatar,
      google_id,
    });
    return user;
  }

  async index() {
    const users = await knex(USERS_TABLE).select("*");
    return users;
  }

  async show(id) {
    const user = await knex(USERS_TABLE).where({ id }).first();
    return user;
  }

  async delete(id) {
    const user = await knex(USERS_TABLE).where({ id }).delete();
    return user;
  }

  async update(id, user) {
    const userUpdated = await knex(USERS_TABLE).where({ id }).update(user);
    return userUpdated;
  }
}

module.exports = new UsersRepository();
