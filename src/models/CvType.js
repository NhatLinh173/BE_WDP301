const mongoose = require("mongoose");

const cvTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("CVType", cvTypeSchema);
