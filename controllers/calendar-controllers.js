const {
  fetchMealsForUserByDate,
  addMealForUserByDate,
  updateMealForUserByDate,
  addUserToCalendar,
  removeMealForUserByDate,
  removeUsersCalendar,
} = require("../models/calendar-models");

exports.getMealsForUserByDate = (request, response, next) => {
  const { user_id, date } = request.params;
  fetchMealsForUserByDate(user_id, date)
    .then((meals) => {
      response.status(200).send({ meals });
    })
    .catch(next);
};

exports.postMealForUserByDate = (request, response, next) => {
  const { user_id, date } = request.params;
  const postInfo = request.body;
  addMealForUserByDate(user_id, date, postInfo)
    .then((meals) => {
      response.status(201).send({ meals });
    })
    .catch(next);
};

exports.patchMealForUserByDate = (request, response, next) => {
  const { user_id, date } = request.params;
  const patchInfo = request.body;
  updateMealForUserByDate(user_id, date, patchInfo)
    .then((meals) => {
      response.status(200).send({ meals });
    })
    .catch(next);
};

exports.postUserToCalendar = (request, response, next) => {
  const { user_id } = request.params;
  addUserToCalendar(user_id)
    .then((user_id) => {
      response.status(201).send({ user_id });
    })
    .catch(next);
};

exports.deleteMealForUserByDate = (request, response, next) => {
  const { user_id, date, meal } = request.params;
  removeMealForUserByDate(user_id, date, meal)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

exports.delteUsersCalendar = (request, response, next) => {
  const { user_id } = request.params;
  removeUsersCalendar(user_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};
