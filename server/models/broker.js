const mongoose = require("mongoose");
const brokerSchema = new mongoose.Schema({
  company_name: {
    type: String,
    trim: true,
  },
  email_address: {
    type: String,
    trim: true,
  },
  phone_number: { type: String, trim: true },
  address: String,
  // agents: [
  //   {
  //     name: { type: String, trim: true },
  //     email_address: { type: String, trim: true },
  //     phone_number: { type: String, trim: true },
  //   },
  // ],
});

module.exports = mongoose.model("Broker", brokerSchema);
