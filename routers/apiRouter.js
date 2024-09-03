const { getEndpoints } = require("../controllers/endpoints-controller");
const usersRouter = require("./usersRouter");

apiRouter = require("express").Router();

apiRouter.use("/users", usersRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
