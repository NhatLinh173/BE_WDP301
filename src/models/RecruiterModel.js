const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const recruiterSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    addressCompany: { type: String, require: true },
    phone: { type: Number },
    role: { type: String, default: "recruiter" },
    nameCompany: { type: String },
    gender: { type: String },
  },
  {
    timestamps: true,
  }
);

recruiterSchema.plugin(passportLocalMongoose);
const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;
