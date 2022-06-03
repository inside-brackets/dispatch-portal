const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");

route.post("/fetchlead", carriersController.fetchLead);
route.get("/ok", (req, res, next) => {
  res.send("ok");
});
route.get('/get-closet/:id',carriersController.nearestAppointment)
route.get("/change-type",carriersController.changeTypeController)
route.get("/fetch-counter/:id", carriersController.fetchDialerCounter)
module.exports = route;
