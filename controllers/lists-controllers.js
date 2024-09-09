const {
  fetchListsByUserId,
  addListByUserId,
} = require("../models/lists-models");

exports.getListsByUserId = (request, response, next) => {
  const { user_id } = request.params;
  fetchListsByUserId(user_id)
    .then((lists) => {
      response.status(200).send({ lists });
    })
    .catch(next);
};

exports.postListByUserId = (request, response, next) => {
  const { user_id } = request.params;
  const postInfo = request.body;
  addListByUserId(user_id, postInfo)
    .then((list) => {
      response.status(201).send({ list });
    })
    .catch(next);
};
