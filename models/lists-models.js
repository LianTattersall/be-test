const { collection, doc, getDoc, setDoc } = require("firebase/firestore");
const db = require("../db/connection");
const { list } = require("firebase/storage");
const { merge } = require("../app");

const usersRef = collection(db, "users");
const listsRef = collection(db, "lists");

exports.fetchListsByUserId = (user_id) => {
  const docRef = doc(usersRef, user_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - User not found" });
    }
    const lists = snapShot.data().lists;
    return lists;
  });
};

exports.addListByUserId = (user_id, postInfo) => {
  const { list_id, list_name } = postInfo;
  if (typeof list_id !== "string" || typeof list_name !== "string") {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  const keys = Object.keys(postInfo);
  if (!keys.every((key) => ["list_id", "list_name"].indexOf(key) >= 0)) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid fields on request body",
    });
  }

  const docRef = doc(usersRef, user_id);
  return getDoc(docRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - User not found" });
      }
      const lists = [postInfo, ...snapShot.data().lists];
      return setDoc(docRef, { lists }, { merge: true });
    })
    .then(() => {
      return postInfo;
    });
};

exports.removeListFromUser = (user_id, list_id) => {
  const docRef = doc(usersRef, user_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - User not found" });
    }
    const userData = snapShot.data();
    const ids = userData.lists.map((list) => list.list_id);

    if (ids.indexOf(list_id) === -1) {
      return Promise.reject({
        status: 404,
        message: "404 - List not found on user",
      });
    }
    const removedList = userData.lists.filter(
      (listObj) => listObj.list_id !== list_id
    );
    const userDataCopy = JSON.parse(JSON.stringify(userData));
    userDataCopy.lists = removedList;
    return setDoc(docRef, userDataCopy);
  });
};

exports.fetchListById = (list_id) => {
  const docRef = doc(listsRef, list_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - List not found" });
    }
    return { ...snapShot.data(), list_id };
  });
};

exports.addList = (postInfo) => {
  const greenList = ["list_name", "people"];
  const postKeys = Object.keys(postInfo);

  if (postKeys.length !== 2) {
    return Promise.reject({
      status: 400,
      message: "400 - Incorrect format for request body",
    });
  }
  if (!postKeys.every((key) => greenList.indexOf(key) >= 0)) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid key on request body",
    });
  }
  if (!Array.isArray(postInfo.people)) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid data type. 'people' key should be an array",
    });
  }

  if (!postInfo.people.every((person) => typeof person === "string")) {
    return Promise.reject({
      status: 400,
      message:
        "400 - Invalid data type. 'people array should only contain strings",
    });
  }

  if (typeof postInfo.list_name !== "string") {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid data type. list_name should be a string",
    });
  }
  const docRef = doc(listsRef);
  return setDoc(docRef, { ...postInfo, items: [] })
    .then(() => {
      return getDoc(docRef);
    })
    .then((snapShot) => {
      return { list_id: snapShot.id, items: [], ...postInfo };
    });
};

exports.addListItem = (list_id, itemObj) => {
  const { item } = itemObj;
  const keys = Object.keys(itemObj);
  if (keys[0] !== "item" || keys.length !== 1) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for request body",
    });
  }
  if (typeof item !== "string") {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }

  const docRef = doc(listsRef, list_id);
  return getDoc(docRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - List not found" });
      }
      const data = snapShot.data();
      data.items.push(item);
      return setDoc(docRef, data);
    })
    .then(() => {
      return item;
    });
};

exports.removeAllItems = (list_id) => {
  const docRef = doc(listsRef, list_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - List not found" });
    }
    return setDoc(docRef, { items: [] }, { merge: true });
  });
};

exports.updateListName = (list_id, patchInfo) => {
  if (patchInfo.list_name === undefined) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid request body",
    });
  }
  if (typeof patchInfo.list_name !== "string") {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (Object.keys(patchInfo).length !== 1) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid request body",
    });
  }
  const docRef = doc(listsRef, list_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - List not found" });
    }
    return setDoc(docRef, patchInfo, { merge: true });
  });
};

exports.removeItemByIndex = (list_id, item_index) => {
  const docRef = doc(listsRef, list_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - List not found" });
    }
    const data = snapShot.data();
    if (!data.items[item_index]) {
      return Promise.reject({ status: 404, message: "404 - Item not found" });
    }
    const items = data.items.filter(
      (item, index) => index !== Number(item_index)
    );
    return setDoc(docRef, { items }, { merge: true });
  });
};

exports.addUserToList = (list_id, postInfo) => {
  const postKeys = Object.keys(postInfo);
  const greenList = ["user_id", "display_name"];
  if (
    postKeys.length !== 2 ||
    !postKeys.every((key) => greenList.indexOf(key) >= 0)
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for request body",
    });
  }
  if (!postKeys.every((key) => typeof postInfo[key] === "string")) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  const docRef = doc(listsRef, list_id);
  return getDoc(docRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - List not found" });
      }
      const people = snapShot.data().people;
      people.push(postInfo);
      return setDoc(docRef, { people }, { merge: true });
    })
    .then(() => {
      return postInfo;
    });
};
