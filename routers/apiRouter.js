const { getEndpoints } = require("../controllers/endpoints-controller");
const listsRouter = require("./listsRouter");
const recipiesRouter = require("./recipiesRouter");
const usersRouter = require("./usersRouter");

apiRouter = require("express").Router();

apiRouter.use("/users", usersRouter);

apiRouter.use("/lists", listsRouter);

apiRouter.use("/recipies", recipiesRouter);

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
