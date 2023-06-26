const { Router } = require("express");
const usersRouter = require("./users.routes");
const petsRouter = require("./pets.routes");
const photosRoutes = require("./photos.routes");
const favoritesRouter = require("./favorites.routes");
const sessionsRouter = require("./sessions.routes");
const interestedUsersRoutes = require("./insterestedUsers.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/pets", petsRouter);
routes.use("/photos", photosRoutes);
routes.use("/favorites", favoritesRouter);
routes.use("/interestedUsers", interestedUsersRoutes);

module.exports = routes;
