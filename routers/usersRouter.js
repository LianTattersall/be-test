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
  deleteListFromUser,
} = require("../controllers/lists-controllers");
const {
  getRecipiesByUserId,
  postRecipieToUser,
  deleteRecipieFromUser,
} = require("../controllers/recipies-controllers");
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

usersRouter.delete("/:user_id/lists/:list_id", deleteListFromUser);

usersRouter.get("/:user_id/recipies", getRecipiesByUserId);

usersRouter.post("/:user_id/recipies", postRecipieToUser);

usersRouter.delete("/:user_id/recipies/:recipie_id", deleteRecipieFromUser);

module.exports = usersRouter;
