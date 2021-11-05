const express = require("express");
const route = express.Router();
const carriersController = require("../controllers/carriers");

route.post("/fetchlead", carriersController.fetchLead);
route.get("/ok", (req, res, next) => {
  res.send("ok");
});
module.exports = route;
