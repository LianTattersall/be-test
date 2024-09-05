const { addUser } = require("../models/users-models");

exports.postUser = (request, response, next) => {
  addUser(request.body)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
};
