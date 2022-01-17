const mongoose = require("mongoose");
const Load = require("../models/load");
const Carrier = require("../models/carrier");

const edit = async (req, res) => {
  const result = await Carrier.updateMany(
    {},
    { $rename: { physical_address: "address" } },
    { multi: true }
  );
  res.status(200).send(result);
};

module.exports = {
  edit,
};
