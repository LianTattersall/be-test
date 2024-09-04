const { addUser } = require("../models/users-models");

exports.postUser = (request, response, next) => {
  const { user_id, display_name, avatar_url } = request.body;
  addUser(user_id, display_name, avatar_url)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((err) => {
      console.log(err);
    });
};
