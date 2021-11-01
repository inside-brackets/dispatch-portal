const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  filename: String,
  file: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Files", fileSchema);
