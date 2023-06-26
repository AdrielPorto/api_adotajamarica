require("express-async-errors");
const AppError = require("./utils/AppError");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const usersSwagger = require('./routes/swagger/users.swagger.json');
const photosSwagger = require('./routes/swagger/photos.swagger.json');
const favoritesSwagger = require('./routes/swagger/favorites.swagger.json');

// const petsSwagger = require('./routes/pets.swagger.json');
// const sessionsSwagger = require('./routes/sessions.swagger.json');
// const interestSwagger = require('./routes/interest.swagger.json');

require("dotenv").config();
const routes = require("./routes");
const uploadConfig = require("./configs/upload");

const cors = require("cors");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

var options = {}
app.use('/doc/users', swaggerUi.serveFiles(usersSwagger, options), swaggerUi.setup(usersSwagger));
app.use('/doc/photos', swaggerUi.serveFiles(photosSwagger, options), swaggerUi.setup(photosSwagger));
app.use('/doc/favorites', swaggerUi.serveFiles(favoritesSwagger, options), swaggerUi.setup(favoritesSwagger));

app.use((erro, request, response, next) => {
  if (erro instanceof AppError) {
    return response.status(erro.statusCode).json({
      status: "error",
      message: erro.message,
    });
  }

  console.error(erro);

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server AdotaJaMarica listening on port ${PORT}`);
});
