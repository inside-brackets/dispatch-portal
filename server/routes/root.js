const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");
const {
  addNewInvoice,
  getInvoices,
  updateInvoiceStatus,
} = require("../controllers/invoices");
const loadsController = require("../controllers/loads");
const userController = require("../controllers/users");
const { setIp, getIpList } = require("../util/ipList");

route.post("/addnewtruck", carriersController.addNewTruck);
route.post("/getcarrier", carriersController.getCarrier);
route.post("/getcarriers", carriersController.getCarriers);
route.post("/getloads", loadsController.getLoads);
route.post("/getload", loadsController.getLoad);
route.post("/getuser", userController.getUser);
route.post("/getusers", userController.getUsers);
route.post("/getinvoices", getInvoices);
route.put("/updatecarrier/:mcNumber", carriersController.updateCarrier);
route.put("/addnewTruck/:mcNumber", carriersController.addNewTruck);
route.get(
  "/deletetruck/:mcNumber/:truckNumber",
  carriersController.deleteTruck
);
route.post("/createinvoice", addNewInvoice);
route.put("/updateinvoice", updateInvoiceStatus);

route.post("/updateuser", userController.updateUser);
route.post("/uploadfile/:type", (req, res) => {
  res.send(`/${req.files[0].path}`);
  console.log(req);
});
route.get("/countcarriers", carriersController.countCarriers);
route.post("/whitelist/:mac/:ip", (req, res) => {
  setIp(req.params.mac, req.params.ip);
  console.log("ip list", getIpList());
  res.send("done");
});
route.get("/myip", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  ip = ip.replace("::ffff:", "").trim();
  res.send(ip);
});
route.get("/hello", (req, res) => {
  res.send("hello");
});
module.exports = route;
