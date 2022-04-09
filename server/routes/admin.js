const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");
const usersController = require("../controllers/users");
const invoiceController = require("../controllers/invoices");

route.post(
  "/assigndispatcher/:mc/:truckNumber",
  carriersController.assignDispatcher
);
route.post("/createuser", usersController.addNewUser);
route.delete("/deleteuser", usersController.deleteUser);
route.put("/clearinvoice", invoiceController.clearInvoice);

route.post("/top-sales",invoiceController.topSales)
route.post("/top-dispatcher",invoiceController.topDispatcher)

module.exports = route;
