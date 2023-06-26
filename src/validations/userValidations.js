const { body } = require("express-validator");

const errorMessages = {
  nome: "Nome é obrigatório",
  email: "E-mail inválido",
  senha: "Senha deve conter pelo menos 8 caracteres",
  telefone: "Telefone inválido",
  categoria: "Categoria é obrigatória",
};

const isMobilePhoneWithDDD = (value) => {
  // Remove todos os caracteres não numéricos
  const phoneNumber = value.replace(/\D/g, "");

  // Verifica se o número de telefone possui 11 dígitos (incluindo DDD)
  return /^\d{11}$/.test(phoneNumber);
};

const userValidations = [
  body("nome").notEmpty().withMessage(errorMessages.nome),
  body("email").isEmail().withMessage(errorMessages.email),
  body("senha").isLength({ min: 8 }).withMessage(errorMessages.senha),
  body("telefone")
    .custom(isMobilePhoneWithDDD)
    .withMessage(errorMessages.telefone),
  body("categoria").notEmpty().withMessage(errorMessages.categoria),
];

module.exports = userValidations;
