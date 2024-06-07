const CandidateModel = require("../models/CandidateModel");
const UserRouter = require("./UserRouter");
const CandidateRouter = require("./CandidateRouter");
// container all API
const routes = (app) => {
  app.use("/api", UserRouter);
  app.use("/api/user/candidate", CandidateRouter);
};

module.exports = routes;
