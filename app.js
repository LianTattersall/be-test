const express = require("express");

const app = express();

const firebase = process.env.FIREBASE;

app.get("/api", (req, res) => {
  res.status(200).send({ hello: "world" });
});

app.get("/api/firebase", (req, res) => {
  res.status(200).send(firebase);
});

app.listen(9000, () => {
  console.log("listening on 9000");
});
