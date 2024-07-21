const CandidateModel = require("../models/CandidateModel");
const UserRouter = require("./UserRouter");
const CandidateRouter = require("./CandidateRouter");
const CVRouter = require("./CVRouter");
const JobRouter = require("./jobRouter");
const imageRouter = require("./imageRouter");
const recruiterRouter = require("./RecruiterRouter");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// container all API
const routes = (app) => {
  app.use("/api", UserRouter);
  app.use("/api/user/candidate", CandidateRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/CV", CVRouter);
  app.use("/job", JobRouter);
  app.use("/api/images", imageRouter);
  app.use("/recruiter", recruiterRouter);
};
// container all API
module.exports = routes;
