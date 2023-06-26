const { Router } = require("express");

const InterestedUsersController = require("../controllers/InterestedUsersController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const interestedUsersRoutes = Router();
const interestedUsersController = new InterestedUsersController();

interestedUsersRoutes.use(ensureAuthenticated);

interestedUsersRoutes.get("/", interestedUsersController.index);

interestedUsersRoutes.get(
  "/checkUser/:pet_id",
  interestedUsersController.checkIfUserIsInterested
);

interestedUsersRoutes.patch("/", interestedUsersController.update);

interestedUsersRoutes.delete("/:id", interestedUsersController.delete);

interestedUsersRoutes.post("/", interestedUsersController.create);

module.exports = interestedUsersRoutes;
