const jobService = require("../service/jobService");

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
      industry,
      address,
      country,
      state,
    } = req.body;

    try {
      const job = await jobService.createJobPost({
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
        industry,
        address,
        country,
        state,
      });

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
    console.log("alo");
    try {
      const jobPost = await jobService.getAllJobPost();
      res.status(201).json(jobPost);
    } catch (error) {
      console.error("Error fetching job post: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = jobPostController;
