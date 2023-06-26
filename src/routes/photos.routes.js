const { Router } = require("express");
const multer = require("multer");

const PhotosController = require("../controllers/PhotosController");

const photosRoutes = Router();

const photosController = new PhotosController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const uploadConfig = require("../configs/upload");

const upload = multer(uploadConfig.MULTER);

photosRoutes.get("/", photosController.index);

photosRoutes.get("/:pet_id", photosController.show);

photosRoutes.get("/pets/:pet_id", photosController.findByPet);

photosRoutes.post(
  "/:id",
  ensureAuthenticated,
  upload.array("photoPet", 4),
  photosController.create
);

photosRoutes.delete(
  "/deleteByPetUrl",
  ensureAuthenticated,

  photosController.deleteByPetUrl
);

module.exports = photosRoutes;
