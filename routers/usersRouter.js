const {
  getMealsForUserByDate,
  postMealForUserByDate,
  patchMealForUserByDate,
  postUserToCalendar,
} = require("../controllers/calendar-controllers");
const { postUser } = require("../controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/:user_id/calendar/:date", getMealsForUserByDate);

usersRouter.post("/:user_id/calendar/:date", postMealForUserByDate);

usersRouter.patch("/:user_id/calendar/:date", patchMealForUserByDate);

usersRouter.post("/", postUser);

usersRouter.post("/:user_id/calendar", postUserToCalendar);

module.exports = usersRouter;
