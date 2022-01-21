const mongoose = require("mongoose");
const Load = require("../models/load");
const Carrier = require("../models/carrier");
const User = require("../models/user");

const edit = async (req, res) => {
  const result = await Carrier.updateMany(
    {},
    { $rename: { physical_address: "address" } },
    { multi: true }
  );
  res.status(200).send(result);
};

const test = async (req, res) => {
  try {
    const users = await User.updateMany(
      {},
      { $set: { u_status: "active" } },
      { new: true }
    );
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  edit,
  test,
};
