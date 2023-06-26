const { body } = require("express-validator");

const errorMessages = {
  nome: "O nome do pet é obrigatório",
  especie: "A espécie do pet é obrigatória",
  raca: "A raça do pet é obrigatória",
  faixa_etaria: "A Faixa etária do pet é obrigatória",
  genero: "O gênero do pet é obrigatório",
  porte_fisico: "O porte físico do pet é obrigatório",
  vacinado: "A informação se o pet está vacinado é obrigatória",
  vermifugado: "A informação se o pet está vermifugado é obrigatória",
  disponibilidade: "A informação se o pet está disponível é obrigatória",
};

const petValidations = [
  body("nome").notEmpty().withMessage(errorMessages.nome),
  body("especie").notEmpty().withMessage(errorMessages.especie),
  body("raca").notEmpty().withMessage(errorMessages.raca),
  body("faixa_etaria").notEmpty().withMessage(errorMessages.idade),
  body("genero").notEmpty().withMessage(errorMessages.genero),
  body("porte_fisico").notEmpty().withMessage(errorMessages.porte_fisico),
  body("vacinado").optional().notEmpty().withMessage(errorMessages.vacinado),
  body("vermifugado").notEmpty().withMessage(errorMessages.vermifugado),
  body("disponibilidade").notEmpty().withMessage(errorMessages.disponibilidade),
];

module.exports = petValidations;
