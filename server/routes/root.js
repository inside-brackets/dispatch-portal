const User = require("../models/user");
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
const { generateUploadURL } = require("../util/s3");
const { edit } = require("../controllers/db");

route.post("/addnewtruck", carriersController.addNewTruck);
route.post("/getcarrier", carriersController.getCarrier);
route.post("/getcarriers", carriersController.getCarriers);
route.put("/updatecarrier/:mcNumber", carriersController.updateCarrier);
route.put("/addnewTruck/:mcNumber", carriersController.addNewTruck);
route.get(
  "/deletetruck/:mcNumber/:truckNumber",
  carriersController.deleteTruck
);
route.post("/countcarriers", carriersController.countCarriers);
route.put(
  "/updatetruck/:mcNumber/:trucknumber",
  carriersController.updateTruck
);
// user
route.post("/getuser", userController.getUser);
route.post("/getusers", userController.getUsers);
route.post("/updateuser", userController.updateUser);

// invoices
route.post("/getinvoices", getInvoices);
route.post("/createinvoice", addNewInvoice);
route.put("/updateinvoice", updateInvoiceStatus);

// loads
route.post("/getloads", loadsController.getLoads);
route.post("/getload", loadsController.getLoad);

// security
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

route.post("/login", (req, res) => {
  try {
    User.findOne({ user_name: req.body.username })
      .select("password")
      .then((data) => {
        res.status(200).send(data);
      });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

//s3-bucket
route.get("/s3url/:folder/:fileName", async (req, res) => {
  const url = await generateUploadURL(req.params.folder, req.params.fileName);
  res.send(url);
});

// edit database
route.post("/editdatabase", edit);

module.exports = route;
