const CandidateModel = require("../models/CandidateModel");
const UserRouter = require("./UserRouter");
const CandidateRouter = require("./CandidateRouter");
const CVRouter = require("./CVRouter");
<<<<<<< HEAD
const JobRouter = require("./jobRouter");
=======
const UploadRouter = require("./uploadRouter");
const DegreeRouter = require("./DegreeRouter");
const JobRouter = require("./jobRouter");
const imageRouter = require("./imageRouter");
const recruiterRouter = require("./RecruiterRouter");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
>>>>>>> 814453f3267ea0bf2a3286bb48646782e4239875
// container all API
const routes = (app) => {
  app.use("/api/user/candidate", CandidateRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/CV", CVRouter);
<<<<<<< HEAD
  app.use("/job", JobRouter)
=======
  app.use("/api/uploadCv", UploadRouter);
  app.use("/api/degrees", DegreeRouter);
  app.use("/job", JobRouter);
  app.use("/api/images", imageRouter);
  app.use("/recruiter", recruiterRouter);
>>>>>>> 814453f3267ea0bf2a3286bb48646782e4239875
};

module.exports = routes;
