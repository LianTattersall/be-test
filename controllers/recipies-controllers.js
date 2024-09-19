const {
  fetchRecipiesByUserId,
  addRecipieToUser,
  fetchRecipieById,
  removeRecipieById,
  addRecipie,
  updateRecipie,
  removeRecpieFromUser,
} = require("../models/recipies-models");

exports.getRecipiesByUserId = (request, response, next) => {
  const { user_id } = request.params;
  fetchRecipiesByUserId(user_id)
    .then((recipies) => {
      response.status(200).send({ recipies });
    })
    .catch(next);
};

exports.postRecipieToUser = (request, response, next) => {
  const { user_id } = request.params;
  addRecipieToUser(user_id, request.body)
    .then((recipie) => {
      response.status(201).send({ recipie });
    })
    .catch(next);
};

exports.getRecipieById = (request, response, next) => {
  const { recipie_id } = request.params;
  fetchRecipieById(recipie_id)
    .then((recipie) => {
      response.status(200).send({ recipie });
    })
    .catch(next);
};

exports.deleteRecipieById = (request, response, next) => {
  const { recipie_id } = request.params;
  removeRecipieById(recipie_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

exports.postRecipie = (request, response, next) => {
  addRecipie(request.body)
    .then((recipie) => {
      response.status(201).send({ recipie });
    })
    .catch(next);
};

exports.patchRecipie = (request, response, next) => {
  const { recipie_id } = request.params;
  updateRecipie(request.body, recipie_id)
    .then((recipie) => {
      response.status(200).send({ recipie });
    })
    .catch(next);
};

exports.deleteRecipieFromUser = (request, response, next) => {
  const { recipie_id, user_id } = request.params;
  removeRecpieFromUser(recipie_id, user_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};
