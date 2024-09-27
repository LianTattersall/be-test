const { list } = require("firebase/storage");
const { response } = require("../app");
const {
  fetchListsByUserId,
  addListByUserId,
  removeListFromUser,
  fetchListById,
  addList,
  addListItem,
  removeAllItems,
  updateListName,
  removeItemByIndex,
  addUserToList,
  removeUserFromList,
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

exports.deleteListFromUser = (request, response, next) => {
  const { user_id, list_id } = request.params;
  removeListFromUser(user_id, list_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

exports.getListById = (request, response, next) => {
  const { list_id } = request.params;
  fetchListById(list_id)
    .then((list) => {
      response.status(200).send({ list });
    })
    .catch(next);
};

exports.postList = (request, response, next) => {
  addList(request.body)
    .then((list) => {
      response.status(201).send({ list });
    })
    .catch(next);
};

exports.postListItem = (request, response, next) => {
  const { list_id } = request.params;
  addListItem(list_id, request.body)
    .then((items) => {
      response.status(201).send({ items });
    })
    .catch(next);
};

exports.deleteAllItems = (request, response, next) => {
  const { list_id } = request.params;
  removeAllItems(list_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

exports.patchListName = (request, response, next) => {
  const { list_id } = request.params;
  const patchInfo = request.body;
  updateListName(list_id, patchInfo)
    .then(() => {
      response.status(200).send(patchInfo);
    })
    .catch(next);
};

exports.deleteItemByIndex = (request, response, next) => {
  const { list_id, item_index } = request.params;
  removeItemByIndex(list_id, item_index)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};

exports.postUserToList = (request, response, next) => {
  const { list_id } = request.params;
  addUserToList(list_id, request.body)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
};

exports.deleteUserFromList = (request, response, next) => {
  const { list_id, user_id } = request.params;
  removeUserFromList(list_id, user_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch(next);
};
