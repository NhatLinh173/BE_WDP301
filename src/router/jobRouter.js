const express = require("express");
const router = express.Router();
const jobPostController = require("../controller/jobController");

router.post("/create-job-post", jobPostController.createJobPost);
router.get("/", jobPostController.getAll);

module.exports = router;
