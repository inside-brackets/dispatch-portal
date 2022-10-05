const express = require("express");

const route = express.Router();
const carriersController = require("../controllers/carriers");
const {
  addNewInvoice,
  getInvoices,
  getTableInvoices,
  updateInvoiceStatus,
} = require("../controllers/invoices");
const loadsController = require("../controllers/loads");
const userController = require("../controllers/users");
const { rename, test, changeAppointment,findDublicates,changeStatus, addCarrierIdInInvoices } = require("../controllers/db");

const { setIp, getIpList } = require("../util/ipList");
const { generateUploadURL,deleteUploadedURL } = require("../util/s3");
const auth = require("../middlewares/auth");

// const upload = require("../middlewares/upload");

route.post("/addnewtruck", carriersController.addNewTruck);
route.post("/add-new-carrier", carriersController.addNewCarrier);
route.post("/getcarrier", carriersController.getCarrier);
route.post("/get-table-carriers", carriersController.getTableCarriers);
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
route.get("/getuser/:id", userController.getUser);
route.post("/getusers", userController.getUsers);
route.post("/get-table-users", userController.getTableUsers);
// route.post("/updateuser", userController.updateUser);
route.post("/updateuser/:id", userController.updateUser);
route.get("/refreshtoken/:id",userController.refreshToken)
route.get("/count-user/:company",userController.countUsers)

// invoices
route.post("/getinvoices", getInvoices);
route.post("/get-table-invoices", getTableInvoices);

route.post("/createinvoice", addNewInvoice);
route.put("/updateinvoice", updateInvoiceStatus);

// loads
route.post("/getloads", loadsController.getLoads);
route.post("/get-table-loads", loadsController.getTableLoads);
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

route.post("/login", auth, userController.login);

//s3-bucket
route.get("/s3url/:folder/:fileName/:del?", async (req, res) => {
  const url = await generateUploadURL(req.params.folder, req.params.fileName,req.params.del);
  res.send(url);
});
route.get("/s3url-delete/:folder/:fileName", async (req, res) => {
  const response = await deleteUploadedURL(req.params.folder, req.params.fileName);
  res.send(response);
});

// edit database
route.post("/rename", rename);
route.post("/test", test);
route.post("/changeappointment", changeAppointment);
route.get("/dublicates",findDublicates)
route.get("/change-status",changeStatus)
route.get("/add-id-invoices", addCarrierIdInInvoices)


module.exports = route;
