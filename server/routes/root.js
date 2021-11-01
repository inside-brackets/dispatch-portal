const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");
const loadsController = require("../controllers/loads");
const userController = require("../controllers/users");

route.post("/addnewtruck", carriersController.addNewTruck);
route.post("/getcarrier", carriersController.getCarrier);
route.post("/getcarriers", carriersController.getCarriers);
route.post("/getloads", loadsController.getLoads);
route.post("/getload", loadsController.getLoad);
route.post("/getuser", userController.getUser);
route.post("/getusers", userController.getUsers);
route.put("/updatecarrier/:mcNumber", carriersController.updateCarrier);
route.put("/addnewTruck/:mcNumber", carriersController.addNewTruck);
route.get(
  "/deletetruck/:mcNumber/:truckNumber",
  carriersController.deleteTruck
);

route.post("/updateuser", userController.updateUser);
route.post("/uploadfile/:type", (req, res) => {
  res.send("okay");
});
module.exports = route;
