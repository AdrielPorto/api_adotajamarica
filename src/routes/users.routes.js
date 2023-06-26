const { Router } = require("express");
const multer = require("multer");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const uploadConfig = require("../configs/upload");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();

usersRoutes.get("/", usersController.index);

usersRoutes.get("/:id", usersController.show);

usersRoutes.post("/recovery", usersController.recoveryPassword);

usersRoutes.post("/", usersController.create);

usersRoutes.post("/google", usersController.createGoogle);

usersRoutes.put("/", ensureAuthenticated, usersController.update);

usersRoutes.delete("/", ensureAuthenticated, usersController.delete);

usersRoutes.patch("/reset", usersController.resetPassword);

usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  usersController.updateAvatar
);

module.exports = usersRoutes;
