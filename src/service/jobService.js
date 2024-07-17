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
    try {
      const jobPost = await Job.find();
      return jobPost;
    } catch (error) {
      console.error("Error fetching get all job post", error);
      throw error;
    }
  },

  getJobPostbyId: async (jobId) => {
    try {
      const job = await Job.findById(jobId);
      return job;
    } catch (error) {
      console.error("Error fetching product: ", error);
      throw error;
    }
  },
  updateJobPost: async (jobId, newData) => {
    try {
      const updateJob = await Job.findByIdAndUpdate(jobId, newData, {
        new: true,
      });
      return updateJob;
    } catch (error) {
      console.error("Error updating job post: ", error);
      throw error;
    }
  },

  removeJobPost: async (jobId) => {
    try {
      const removeJobPost = await Job.findByIdAndDelete(jobId);
      return removeJobPost;
    } catch (error) {
      console.error(`Error deleting job post wwith ID  ${jobId}: `, error);
      throw error;
    }
  },
};

module.exports = jobPostService;
