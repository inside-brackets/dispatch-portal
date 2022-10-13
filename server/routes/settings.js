const express = require("express");
const {
  updateSettings,
  getMCSettings,
  getFreeResources,
  freeUpResource,
} = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getMCSettings);
router.post("/free", getFreeResources);
router.get("/freeres", freeUpResource);

module.exports = router;
