const {
  getMealsForUserByDate,
  postMealForUserByDate,
  patchMealForUserByDate,
} = require("../controllers/calendar-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/:user_id/calendar/:date", getMealsForUserByDate);

usersRouter.post("/:user_id/calendar/:date", postMealForUserByDate);

usersRouter.patch("/:user_id/calendar/:date", patchMealForUserByDate);

module.exports = usersRouter;
