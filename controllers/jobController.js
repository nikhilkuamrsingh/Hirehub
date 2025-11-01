import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Get all active jobs
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

// Post a new job (Employer only)
export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(new ErrorHandler("Only Employers can post jobs.", 400));
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  // Validate required fields
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  // Salary validation
  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(new ErrorHandler("Provide either a fixed salary or a salary range.", 400));
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(new ErrorHandler("Cannot provide both fixed and ranged salary.", 400));
  }

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully!",
    job,
  });
});

// Get jobs posted by logged-in Employer
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(new ErrorHandler("Only Employers can view their jobs.", 400));
  }

  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

// Update a job (Employer only)
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(new ErrorHandler("Only Employers can update jobs.", 400));
  }

  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job updated successfully!",
    job: updatedJob,
  });
});

// Delete a job (Employer only)
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(new ErrorHandler("Only Employers can delete jobs.", 400));
  }

  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job deleted successfully!",
  });
});

// Get single job details
export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  res.status(200).json({
    success: true,
    job,
  });
});
