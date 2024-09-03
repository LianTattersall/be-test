const endpointsObj = require("../endpoints.json");

exports.getEndpoints = (request, response, next) => {
  response.status(200).send({ endpoints: endpointsObj });
};
