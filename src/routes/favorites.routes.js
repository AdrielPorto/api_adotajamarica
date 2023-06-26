const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");

const favoritesRoutes = Router();
const favoritesController = new FavoritesController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

favoritesRoutes.use(ensureAuthenticated);

favoritesRoutes.get("/", favoritesController.index);

favoritesRoutes.post("/", favoritesController.create);

favoritesRoutes.delete("/:id", ensureAuthenticated, favoritesController.delete);

module.exports = favoritesRoutes;
