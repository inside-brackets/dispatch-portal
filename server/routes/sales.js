const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");

route.post("/fetchlead", carriersController.fetchLead);
route.post("/saleclosed/:mc", carriersController.saleClosed);
route.get("/ok", (req, res, next) => {
  res.send("ok");
});
module.exports = route;
