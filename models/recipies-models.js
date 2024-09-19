const {
  collection,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} = require("firebase/firestore");
const db = require("../db/connection");

const usersRef = collection(db, "users");
const recipiesRef = collection(db, "recipies");

exports.fetchRecipiesByUserId = (user_id) => {
  const docRef = doc(usersRef, user_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - User not found" });
    }
    return snapShot.data().recipies;
  });
};

exports.addRecipieToUser = (user_id, postInfo) => {
  const postInfoKeys = Object.keys(postInfo);
  const greenList = ["recipie_id", "recipie_name"];
  if (
    !postInfoKeys.every((key) => greenList.indexOf(key) >= 0) ||
    postInfoKeys.length !== 2
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for request body",
    });
  }

  if (!postInfoKeys.every((key) => typeof postInfo[key] === "string")) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }

  const docRef = doc(usersRef, user_id);
  return getDoc(docRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - User not found" });
      }
      const recipies = snapShot.data().recipies;
      recipies.push(postInfo);
      return setDoc(docRef, { recipies }, { merge: true });
    })
    .then(() => {
      return postInfo;
    });
};

exports.fetchRecipieById = (recipie_id) => {
  const docRef = doc(recipiesRef, recipie_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({
        status: 404,
        message: "404 - Recipie not found",
      });
    }
    return { ...snapShot.data(), recipie_id: snapShot.id };
  });
};

exports.removeRecipieById = (recipie_id) => {
  const docRef = doc(recipiesRef, recipie_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({
        status: 404,
        message: "404 - Recipie not found",
      });
    }
    return deleteDoc(docRef);
  });
};

exports.addRecipie = (postInfo) => {
  const postKeys = Object.keys(postInfo);
  const greenList = [
    "recipie_name",
    "ingredients",
    "author",
    "image_url",
    "method",
  ];

  if (
    !postKeys.every((key) => greenList.indexOf(key) >= 0) ||
    postKeys.length !== 5
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for request body",
    });
  }
  if (
    typeof postInfo.recipie_name !== "string" ||
    typeof postInfo.method !== "string" ||
    typeof postInfo.image_url !== "string"
  ) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (!Array.isArray(postInfo.ingredients)) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (!postInfo.ingredients.every((ing) => typeof ing === "string")) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (typeof postInfo.author !== "object") {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for author",
    });
  }
  const authorKeys = Object.keys(postInfo.author);
  if (
    !authorKeys.every(
      (key) =>
        ["user_id", "display_name"].indexOf(key) >= 0 &&
        typeof postInfo.author[key] === "string"
    )
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for author",
    });
  }
  const authorRef = doc(usersRef, postInfo.author.user_id);
  const docRef = doc(recipiesRef);
  return getDoc(authorRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - User not found" });
      }
      return setDoc(docRef, postInfo);
    })
    .then(() => {
      return { ...postInfo, recipie_id: docRef.id };
    });
};

exports.updateRecipie = (patchInfo, recipie_id) => {
  const postKeys = Object.keys(patchInfo);
  const greenList = [
    "recipie_name",
    "ingredients",
    "author",
    "image_url",
    "method",
  ];

  if (
    !postKeys.every((key) => greenList.indexOf(key) >= 0) ||
    postKeys.length !== 5
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for request body",
    });
  }
  if (
    typeof patchInfo.recipie_name !== "string" ||
    typeof patchInfo.method !== "string" ||
    typeof patchInfo.image_url !== "string"
  ) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (!Array.isArray(patchInfo.ingredients)) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (!patchInfo.ingredients.every((ing) => typeof ing === "string")) {
    return Promise.reject({ status: 400, message: "400 - Invalid data type" });
  }
  if (typeof patchInfo.author !== "object") {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for author",
    });
  }
  const authorKeys = Object.keys(patchInfo.author);
  if (
    !authorKeys.every(
      (key) =>
        ["user_id", "display_name"].indexOf(key) >= 0 &&
        typeof patchInfo.author[key] === "string"
    )
  ) {
    return Promise.reject({
      status: 400,
      message: "400 - Invalid format for author",
    });
  }
  const authorRef = doc(usersRef, patchInfo.author.user_id);
  const docRef = doc(recipiesRef, recipie_id);
  return getDoc(authorRef)
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({ status: 404, message: "404 - User not found" });
      }
      return getDoc(docRef);
    })
    .then((snapShot) => {
      if (!snapShot.exists()) {
        return Promise.reject({
          status: 404,
          message: "404 - Recipie not found",
        });
      }
      return setDoc(docRef, patchInfo);
    })
    .then(() => {
      return { ...patchInfo, recipie_id: docRef.id };
    });
};

exports.removeRecpieFromUser = (recipie_id, user_id) => {
  const docRef = doc(usersRef, user_id);
  return getDoc(docRef).then((snapShot) => {
    if (!snapShot.exists()) {
      return Promise.reject({ status: 404, message: "404 - User not found" });
    }
    let recipies = snapShot.data().recipies;
    if (recipies.every((recipie) => recipie.recipie_id !== recipie_id)) {
      return Promise.reject({
        status: 404,
        message: "404 - Recipie not found on user",
      });
    }
    recipies = recipies.filter((recipie) => recipie.recipie_id !== recipie_id);
    return setDoc(docRef, { recipies }, { merge: true });
  });
};
