const express = require("express");
const { updateSettings, getSettings } = require("../controllers/settings");

const router = express.Router();

router.post("/update", updateSettings);
router.get("/", getSettings);

module.exports = router;
