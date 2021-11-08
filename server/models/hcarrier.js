const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
  {
    mc_number: {
      type: Number,
      require: true,
      unique: true,
    },
    truck_number: Number,
    change: String,
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Carrier", carrierSchema);
