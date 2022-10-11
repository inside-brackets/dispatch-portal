const settings = require("../models/setting");

const updateSettings = async (req, res) => {
  console.log("updateSettings", req.body);
  try {
    let updatedSettings = await settings.findOneAndUpdate(
      {},
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.status(200).send(updatedSettings);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getSettings = async (req, res) => {
  console.log("getSettings");
  try {
    let prevSettings = await settings.findOne({});
    if (!prevSettings) {
      prevSettings = await settings.create({});
    }
    res.status(200).send(prevSettings);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = { updateSettings, getSettings };
