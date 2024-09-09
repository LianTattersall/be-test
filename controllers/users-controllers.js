const { addUser, fetchUsers } = require("../models/users-models");

exports.postUser = (request, response, next) => {
  addUser(request.body)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
};

exports.getUsers = (request, response, next) => {
  const { searchTerm } = request.query;
  fetchUsers(searchTerm).then((users) => {
    response.status(200).send({ users });
  });
};
