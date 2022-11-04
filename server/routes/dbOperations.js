const { test, getUniqueDesignations } = require("../controllers/db");
const express = require("express");

const route = express.Router();
route.post("/test", test);
route.get("/getdesignations", getUniqueDesignations);

module.exports = route;
