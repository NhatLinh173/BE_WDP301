const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  name: { type: String, required: true },
  describe: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String },
  cvType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CVType",
    required: true,
  },
});

module.exports = mongoose.model("CV", cvSchema);
