const mongoose = require("mongoose");

const hCarrierSchema = new mongoose.Schema(
  {
    mc_number: {
      type: Number,
    },
    truck_number: Number,
    change: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hcarrier", hCarrierSchema);
