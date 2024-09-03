const {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} = require("firebase/firestore");
const db = require("./connection.js");
const userData = require("./test-data/users.json");
const usersListsData = require("./test-data/usersLists.json");
const recipiesData = require("./test-data/recipies.json");
const listsData = require("./test-data/lists.json");
const calendarData = require("./test-data/calendar.json");

exports.seed = () => {
  return clearCollection(usersRef)
    .then(() => {
      return populateCollection(usersRef, userData);
    })
    .then(() => {
      return clearCollection(usersListsRef);
    })
    .then(() => {
      return populateCollection(usersListsRef, usersListsData);
    })
    .then(() => {
      return clearCollection(recipiesRef);
    })
    .then(() => {
      return populateCollection(recipiesRef, recipiesData);
    })
    .then(() => {
      return clearCollection(listsRef);
    })
    .then(() => {
      return populateCollection(listsRef, listsData);
    })
    .then(() => {
      return clearCollection(calendarRef);
    })
    .then(() => {
      return populateCollection(calendarRef, calendarData);
    });
};

function populateCollection(colRef, data) {
  const docArr = data.map((data) => doc(colRef, data.id));
  const dataCopy = JSON.parse(JSON.stringify(data));
  dataCopy.forEach((element) => {
    delete element.id;
  });
  const promiseDataArr = docArr.map((document, index) =>
    setDoc(document, dataCopy[index])
  );
  return Promise.all(promiseDataArr);
}

function clearCollection(colRef) {
  return getDocs(colRef).then((data) => {
    const docs = data.docs;
    const docIds = docs.map((document) => document.id);
    const docRefs = docIds.map((id) => doc(colRef, id));
    const deletePromiseArr = docRefs.map((ref) => deleteDoc(ref));
    return Promise.all(deletePromiseArr);
  });
}

const usersRef = collection(db, "users");
const usersListsRef = collection(db, "usersLists");
const recipiesRef = collection(db, "recipies");
const listsRef = collection(db, "lists");
const calendarRef = collection(db, "calendar");
