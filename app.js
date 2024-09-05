const express = require("express");
const apiRouter = require("./routers/apiRouter");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send(err);
  }
});

module.exports = app;
