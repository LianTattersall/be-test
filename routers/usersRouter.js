const {
  getMealsForUserByDate,
  postMealForUserByDate,
  patchMealForUserByDate,
  postUserToCalendar,
  deleteMealForUserByDate,
} = require("../controllers/calendar-controllers");
const {
  getListsByUserId,
  postListByUserId,
} = require("../controllers/lists-controllers");
const { postUser, getUsers } = require("../controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/:user_id/calendar/:date", getMealsForUserByDate);

usersRouter.post("/:user_id/calendar/:date", postMealForUserByDate);

usersRouter.patch("/:user_id/calendar/:date", patchMealForUserByDate);

usersRouter.post("/", postUser);

usersRouter.get("/", getUsers);

usersRouter.post("/:user_id/calendar", postUserToCalendar);

usersRouter.delete("/:user_id/calendar/:date/:meal", deleteMealForUserByDate);

usersRouter.get("/:user_id/lists", getListsByUserId);

usersRouter.post("/:user_id/lists", postListByUserId);

module.exports = usersRouter;
