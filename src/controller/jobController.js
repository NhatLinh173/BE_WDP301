const Job = require("../models/job");
const User = require("../models/UserModel");
const jobService = require("../service/jobService");
const upload = require("../utils/upload");

const jobPostController = {
  createJobPost: async (req, res) => {
    const {
      title,
      description,
      jobType,
      jobCategories,
      salaryType,
      minSalary,
      maxSalary,
      skills,
      qualifications,
      experience,
      address,
      country,
      state,
      workingDays,
      nameCompany,
      createdAt,
      workPlace,
      reason,
      userId,
    } = req.body;

    try {
      const createdAtDate = new Date(createdAt);
      const createdAtString = createdAtDate.toISOString().split("T")[0];

      const expiredDate = new Date(createdAtDate);
      expiredDate.setDate(createdAtDate.getDate() + 5);
      const expiredDateString = expiredDate.toISOString().split("T")[0];

      const formData = {
        title,
        description,
        jobType,
        jobCategories,
        salaryType,
        minSalary,
        maxSalary,
        skills,
        qualifications,
        experience,
        address,
        country,
        state,
        workingDays,
        nameCompany,
        createdAt: createdAtString,
        workPlace,
        reason,
        userId,
        status: "active",
        expiredDate: expiredDateString,
      };

      if (req.file) {
        formData.image = `uploads/${req.file.filename}`;
      }

      const job = await jobService.createJobPost(formData);

      res.status(201).json({
        message: "Job posted successfully",
        job: job,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to post job",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const jobPost = await jobService.getAllJobPost();
      res.status(201).json(jobPost);
    } catch (error) {
      console.error("Error fetching job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getJobById: async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await jobService.getJobPostbyId(jobId);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error fetching job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;
      const newData = req.body;
      const updateJob = await jobService.updateJobPost(jobId, newData);
      if (!updateJob) {
        return res.status(404).json({ error: "Job post not found" });
      }
      res.status(200).json(updateJob);
    } catch (error) {
      console.error("Error updating job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  removeJobPost: async (req, res) => {
    try {
      const jobId = req.params.id;
      const removeJobPost = await jobService.removeJobPost(jobId);
      if (!removeJobPost) {
        return res.status(404).json({ error: "Job post not found" });
      }
      res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
      console.error("Error delete job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  applyForJob: [
    upload.fields([{ name: "cvPath" }, { name: "degreePath" }]),
    async (req, res) => {
      try {
        const { jobId, userId } = req.params;
        const { fullName, email, phone, introduce } = req.body;

        const cvPath = req.files["cvPath"] ? req.files["cvPath"][0].path : null;
        const degreePath = req.files["degreePath"]
          ? req.files["degreePath"][0].path
          : null;

        const job = await Job.findById(jobId);
        const user = await User.findById(userId);

        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const application = {
          applicant: userId,
          cvPath,
          degreePath,
          fullName,
          email,
          phone,
          introduce,
        };

        job.applications.push(application);
        await job.save();

        res.status(200).json({ message: "Application submitted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  ],
};

module.exports = jobPostController;
