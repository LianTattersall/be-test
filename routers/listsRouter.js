const {
  getListById,
  postList,
  postListItem,
  deleteAllItems,
  patchListName,
  deleteItemByIndex,
  postUserToList,
} = require("../controllers/lists-controllers");

const listsRouter = require("express").Router();

listsRouter.get("/:list_id", getListById);

listsRouter.patch("/:list_id", patchListName);

listsRouter.post("/", postList);

listsRouter.post("/:list_id/items", postListItem);

listsRouter.delete("/:list_id/items", deleteAllItems);

listsRouter.delete("/:list_id/items/:item_index", deleteItemByIndex);

listsRouter.post("/:list_id/people", postUserToList);

module.exports = listsRouter;
