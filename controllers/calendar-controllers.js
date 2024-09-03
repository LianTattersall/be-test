const {
  fetchMealsForUserByDate,
  addMealForUserByDate,
  updateMealForUserByDate,
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
  updateMealForUserByDate(user_id, date, patchInfo).then((meals) => {
    response.status(200).send({ meals });
  });
};
