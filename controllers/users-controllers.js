const {
  addUser,
  fetchUsers,
  updateUser,
  removeUser,
  fetchUserById,
} = require("../models/users-models");

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

exports.patchUser = (request, response, next) => {
  const { user_id } = request.params;
  updateUser(user_id, request.body)
    .then((patchInfo) => {
      response.status(200).send(patchInfo);
    })
    .catch(next);
};

exports.deleteUser = (request, response, next) => {
  const { user_id } = request.params;
  removeUser(user_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

exports.getUserById = (request, response, next) => {
  const { user_id } = request.params;
  fetchUserById(user_id)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};
