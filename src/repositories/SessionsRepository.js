const knex = require("../database");

class SessionsRepository {
  async findUserByEmail(email) {
    const [user] = await knex("usuarios").where({ email });
    return user;
  }

  async findUserByGoogleId(google_id) {
    const [user] = await knex("usuarios").where({ google_id });
    return user;
  }
}

module.exports = new SessionsRepository();
