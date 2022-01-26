const mongoose = require("mongoose");
const Load = require("../models/load");
const Carrier = require("../models/carrier");
const User = require("../models/user");

const rename = async (req, res) => {
  const result = await Load.updateMany(
    {},
    { $rename: { ratecons: "ratecon" } },
    { multi: true }
  );
  res.status(200).send(result);
};

const test = async (req, res) => {
  try {
    const carriers = await Carrier.find().populate("salesman");
    carriers.filter((item) => item.salesman === null);
    res.status(200).send(carriers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  rename,
  test,
};
