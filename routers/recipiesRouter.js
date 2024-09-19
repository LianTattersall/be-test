const {
  getRecipieById,
  deleteRecipieById,
  postRecipie,
  patchRecipie,
} = require("../controllers/recipies-controllers");

const recipiesRouter = require("express").Router();

recipiesRouter.get("/:recipie_id", getRecipieById);

recipiesRouter.delete("/:recipie_id", deleteRecipieById);

recipiesRouter.post("/", postRecipie);

recipiesRouter.patch("/:recipie_id", patchRecipie);

module.exports = recipiesRouter;
