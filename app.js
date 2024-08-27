const express = require("express");

const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ hello: "world" });
});

app.listen(9000, () => {
  console.log("listening on 9000");
});
