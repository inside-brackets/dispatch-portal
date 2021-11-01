const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");
const usersController = require("../controllers/users");

route.get("/addNewUser", usersController.addNewUser);
route.post(
  "/assigndispatcher/:mc/:truckNumber",
  carriersController.assignDispatcher
);
route.post("/createuser", usersController.addNewUser);
route.delete("/deleteuser", usersController.deleteUser);

module.exports = route;
