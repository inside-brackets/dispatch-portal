const express = require("express");
const route = express.Router();
const brokerController = require("../controllers/brokers");
const loadController = require("../controllers/loads");

route.post("/addnewbroker", brokerController.addNewBroker);
route.post("/addnewload", loadController.addNewLoad);
route.put("/updateload", loadController.updateLoad);

module.exports = route;
