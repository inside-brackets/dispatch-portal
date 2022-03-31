const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
  {
    mc_number: {
      type: Number,
      require: true,
      unique: true,
    },
    company_name: {
      type: String,
      trim: true,
      require: true,
    },
    owner_name: {
      type: String,
      trim: true,
    },
    usdot_number: {
      type: String,
      require: true,
      unique: true,
    },
    c_status: {
      type: String,
      require: true,
      enum: [
        "unassigned",
        "unreached",
        "didnotpick",
        "appointment",
        "rejected",
        "registered",
        "deactivated",
        "in-progress"
      ],
    },
    dispatcher_fee: {
      type: Number,
      min: 0,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    tax_id_number: {
      type: Number,
    },
    email: {
      type: String,
    },
    working_since: {
      type: Date,
    },
    salesman: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    factoring: {
      name: String,
      address: { type: String, trim: true },
      phone_no: String,
      agent_name: String,
      agent_email: String,
    },
    insurance: {
      name: String,
      address: { type: String, trim: true },
      phone_no: String,
      agent_name: String,
      agent_email: String,
    },
    address: { type: String, trim: true },
    power_units: {
      type: Number,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["quickpay", "factoring", "standardpay"],
      default: "factoring",
    },
    trucks: [
      {
        truck_number: {
          type: Number,
          require: true,
          unique: true,
        },
        dispatcher: { type: mongoose.Types.ObjectId, ref: "User" },
        vin_number: {
          type: String,
          require: true,
        },

        trailer_type: {
          type: String,
          required: true,
          enum: [
            "dryvan",
            "flatbed",
            "reefer",
            "gooseneck",
            "stepdeck",
            "lowboy",
            "power only",
          ],
          default: "dryvan",
        },

        carry_limit: {
          type: Number,
          required: true,
        },

        drivers: [
          {
            name: String,
            email_address: String,
            phone_number: String,
          },
        ],

        region: [
          {
            type: String,
            trim: true,
            enum: ["central", "mountain", "pacific", "eastern", "allover"],
            default: "central",
          },
        ],
        temperature_restriction: Number,
        trip_durration: Number,
        off_days: [String],
        t_status: {
          type: String,
          enum: ["new", "pending", "active", "inactive"],
          default: "new",
        },
      },
    ],
    comment: {
      type: String,
    },
    dispatcher_comment: {
      type: String,
    },

    appointment: {
      type: Date,
    },
    mc_file: String,
    noa_file: String,
    insurance_file: String,
    w9_file: String,
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Carrier", carrierSchema);
