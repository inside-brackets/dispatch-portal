const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    carrierCompany: {
      type: String,
      require: true,
    },
    comment: {
      type: String,
    },
    truckNumber: { type: Number, require: true },
    trailerType: { type: String, require: true },

    dispatcher: {
      _id: { type: mongoose.Types.ObjectId, ref: "User" },
      name: String,
    },
    sales: {
      _id: { type: mongoose.Types.ObjectId, ref: "User" },
      name: String,
    },
    startingDate: {
      type: Date,
      require: true,
    },
    endingDate: {
      type: Date,
      require: true,
    },

    loads: {
      type: Array,
      reuire: true,
    },
    dispatcherFee: {
      type: Number,
      require: true,
    },
    totalLoadedMiles: {
      type: Number,
      require: true,
    },
    totalGross: {
      type: Number,
      require: true,
    },
    invoiceStatus: {
      type: String,
      require: true,
      enum: ["pending", "cleared", "cancelled"],
    },
    mc_number: {
      type: Number,
      require: true,
    },

    driver: {
      name: String,
      email_address: String,
      phone_number: String,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
