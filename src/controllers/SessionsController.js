const SessionsCreateService = require("../services/SessionsCreateService");

class SessionsController {
  async store(request, response) {
    const { email, senha, google_id } = request.body;

    const { user, token } = await SessionsCreateService.execute({
      email,
      senha,
      google_id,
    });

    return response.status(201).json({ user, token });
  }
}

module.exports = SessionsController;
