const CandidateModel = require("../models/CandidateModel");
const UserRouter = require("./UserRouter");
const CandidateRouter = require("./CandidateRouter");
const CVRouter = require("./CVRouter");
const UploadRouter = require("./uploadRouter");

// container all API
const routes = (app) => {
  app.use("/api", UserRouter);
  app.use("/api/user/candidate", CandidateRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/CV", CVRouter);
  app.use("/api/uploadCv", UploadRouter);
};
// container all API
module.exports = routes;
