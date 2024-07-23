const express = require("express");
const router = express.Router();
const jobPostController = require("../controller/jobController");
const upload = require("../utils/upload");
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

//trieu - get job by recuiter and applicant
router.get("/recruiter/:userId", jobPostController.listJobsByRecruiter);
router.get("/:id/applicants", jobPostController.listJobApplicants);

module.exports = router;
