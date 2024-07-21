const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Import Schema from mongoose

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    address: { type: String },
    phone: { type: Number },
    access_token: { type: String },
    refresh_token: { type: String },
    role: { type: String, default: "user" },
    candidateProfile: { type: Schema.Types.ObjectId, ref: "CandidateProfile" },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
