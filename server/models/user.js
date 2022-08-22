const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      require: true,
      unique: true,
    },
    profile_image: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    u_status: {
      type: String,
      enum: ["probation", "active", "fired", "inactive","resigned"],
      default: "active",
    },
    password: String,
    date_of_birth: {
      type: Date,
    },
    salary: {
      type: Number,
      require: true,
      trim: true,
    },
    joining_date: {
      type: Date,
      require: true,
    },
    phone_number: {
      type: String,
      trim: true,
    },
    email_address: {
      type: String,
    },
    address: {
      type: String,
    },
    bank_account: {
      type: Number,
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: ["sales", "dispatch", "HR", "admin", "accounts", "undefined"],
      default: "undefined",
    },
    company: {
      type: String,
      enum: ["elite", "alpha", "falcon"],
      required: true,
    },
    leaving_date:{
      type:Date
    },
    files: [
      {
        name: {
          type: String,
          require: true,
        },
        file_type: {
          type: String,
          enum: [
            "cnic",
            "educational_document",
            "experience_document",
            "other",
            "cv",
            "contract",
          ],
          required: true,
        },
        file: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
