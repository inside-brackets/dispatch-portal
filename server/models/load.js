const mongoose = require("mongoose");

const loadSchema = new mongoose.Schema({
  load_number: {
    type: Number,
    require: true,
  },
  l_status: {
    type: String,
    require: true,
    enum: ["booked", "ongoing", "delivered", "canceled"],
  },
  weight: { type: Number },
  miles: { type: Number },
  pay: { type: Number },
  dispatcher: {
    _id: { type: mongoose.Types.ObjectId, ref: "User" },
    name: String,
  },
  broker: String, // broker name
  pick_up: { address: String, date: Date },
  drop: { address: String, date: Date },
  carrier: {
    mc_number: {
      type: Number,
      require: true,
    },
    _id: {
      type: mongoose.Types.ObjectId,
      ref: "Carrier",
    },

    truck_number: Number,
    trailer_type: String,

    driver: {
      name: String,
      email_address: String,
      phone_number: String,
    },
  },
});

module.exports = mongoose.model("Load", loadSchema);
