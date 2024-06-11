const Job = require("../models/job");

const jobPostService = {
  createJobPost: async (jobData) => {
    try {
      const jobPost = new Job(jobData);
      return await jobPost.save();
    } catch (error) {
      console.error("Error fetching create job post", error);
      throw error;
    }
  },

  getAllJobPost: async () => {
    console.log("aloo");
    try {
      const jobPost = await Job.find();
      return jobPost;
    } catch (error) {
      console.error("Error fetching get all job post", error);
      throw error;
    }
  },
};

module.exports = jobPostService;
