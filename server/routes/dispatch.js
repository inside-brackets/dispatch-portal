const express = require("express");
const route = express.Router();
const brokerController = require("../controllers/brokers");
const loadController = require("../controllers/loads");
const reportController = require("../controllers/report");

route.post("/addnewbroker", brokerController.addNewBroker);
route.post("/addnewload", loadController.addNewLoad);
route.put("/updateload", loadController.updateLoad);
// Report
route.post("/addcarrierreport", reportController.addNewReport);
route.post("/getcarrierreport", reportController.getTableCarriersReport);
route.get("/get-carrier-report/:id",reportController.getSingleCarrier);
route.delete("/delete-carrier-report/:id",reportController.deleteReport);
route.post("/graph-data",reportController.lineGraphData)
route.post("/distance-matrix",reportController.getDistanceMatrixData)

module.exports = route;
