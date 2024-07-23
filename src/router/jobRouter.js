const express = require("express");
const router = express.Router();
const jobPostController = require("../controller/jobController");
const upload = require("../utils/upload");
const { sendApplicationMail } = require("../controller/mailController");
router.post(
  "/create-job-post",
  upload.array("images", 10),
  jobPostController.createJobPost
);
router.get("/", jobPostController.getAll);
router.get("/:id", jobPostController.getJobById);
router.delete("/:id", jobPostController.removeJobPost);
router.put("/:id", jobPostController.updateJobPost);
router.post("/apply/:jobId/:userId", jobPostController.applyForJob);
// Lấy application cho từng job
router.get("/:jobId/applications", jobPostController.getJobApplications);
// Gửi mail cho applicantion
router.post('/send-application-mail', sendApplicationMail);

module.exports = router;
