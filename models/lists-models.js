const { collection, doc, getDoc, setDoc } = require("firebase/firestore");
const db = require("../db/connection");

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
