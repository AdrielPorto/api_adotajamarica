const { Router } = require("express");

const PetsController = require("../controllers/PetsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const petsRoutes = Router();
const petsController = new PetsController();

petsRoutes.get("/", petsController.index);

petsRoutes.get("/allPets", petsController.listAllPets);

petsRoutes.get("/allPetsAvailable", petsController.listAllPetsAvailable);

petsRoutes.get("/recentPets", petsController.listRecentPets);

petsRoutes.get("/user/:id", petsController.listUserPets);

petsRoutes.get("/petUser/:id", petsController.listUserPetsAvailable);

petsRoutes.get("/:id", petsController.show);

petsRoutes.post("/", ensureAuthenticated, petsController.create);

petsRoutes.put("/:id", ensureAuthenticated, petsController.update);

petsRoutes.delete("/:id", ensureAuthenticated, petsController.delete);

module.exports = petsRoutes;
