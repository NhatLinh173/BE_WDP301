const Job = require("../models/job");
const User = require("../models/UserModel");
const jobService = require("../service/jobService");
const upload = require("../utils/upload");
const CandidateProfile = require("../models/CandidateModel");
const { sendApplicationEmail } = require("../utils/mailer");

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
        status: "ACTIVE",
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
  //trieu - chuc nang apply job
  applyForJob: [
    upload.fields([{ name: "cvPath" }, { name: "degreePath" }]),
    async (req, res) => {
      try {
        const { jobId, userId } = req.params;
        let candidateProfile = await CandidateProfile.findOne({
          user: userId,
        });
        const selectedJob = await Job.findById(jobId);
        if (!selectedJob) {
          return res.status(404).json({ error: "Job not found" });
        }
        if (!candidateProfile) {
          return res
            .status(404)
            .json({ message: "Candidate profile not found" });
        }

        const alreadyApplied = selectedJob.applications.some(
          (application) => application.applicant.toString() === userId
        );

        if (alreadyApplied) {
          return res
            .status(400)
            .json({ message: "You have already applied for this job." });
        }

        let { fullName, email, phone, image } = candidateProfile;

        if (req.body.fullName) fullName = req.body.fullName;
        if (req.body.email) email = req.body.email;
        if (req.body.phone) phone = req.body.phone;
        if (req.body.image) image = req.body.image;

        const cvPath = req.files["cvPath"] ? req.files["cvPath"][0].path : null;
        const degreePath = req.files["degreePath"]
          ? req.files["degreePath"][0].path
          : null;
        const job = await Job.findById(jobId);
        if (!job) {
          return res.status(404).json({ message: "Job not found" });
        }

        const application = {
          applicant: userId,
          cvPath,
          degreePath,
          fullName,
          email,
          phone,
          image,
          introduce: req.body.introduce,
        };
        job.applications.push(application);
        await job.save();
        sendApplicationEmail(email, selectedJob.title, fullName);

        res.status(200).json({ message: "Application submitted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  ],

  listJobApplicants: async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await jobService.getJobPostById2(jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const applicants = job.applications.map((application) => ({
        applicantId: application.applicant,
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        cvPath: application.cvPath,
        image: application.image,
        degreePath: application.degreePath,
        introduce: application.introduce,
        appliedAt: application.appliedAt,
      }));

      res.status(200).json({ applicants });
    } catch (error) {
      console.error("Error listing job applicants: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  listJobsByRecruiter: async (req, res) => {
    try {
      const recruiterId = req.params.userId;
      const jobs = await jobService.getJobsByRecruiter(recruiterId);

      if (!jobs.length) {
        return res
          .status(404)
          .json({ message: "No jobs found for this recruiter" });
      }

      res.status(200).json({ jobs });
    } catch (error) {
      console.error("Error listing jobs by recruiter: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getJobApplications: async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const applications = await jobService.getJobApplications(jobId);
      if (!applications) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = jobPostController;
