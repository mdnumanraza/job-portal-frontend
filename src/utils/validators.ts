import Joi from "joi"

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("applicant", "employer").required(),
  phone: Joi.string().optional(),
  location: Joi.string().optional(),
  organization: Joi.string().when("role", {
    is: "employer",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const jobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  requirements: Joi.array().items(Joi.string()).min(1).required(),
  location: Joi.string().required(),
  category: Joi.string().valid("imam", "teacher", "tutor", "helper").required(),
  jobType: Joi.string().valid("full-time", "part-time", "contract", "remote").required(),
  salary: Joi.alternatives().try(Joi.number().positive(), Joi.string().valid("Not disclosed")).required(),
})

export const applicationSchema = Joi.object({
  jobId: Joi.string().required(),
  coverLetter: Joi.string().optional(),
  resume: Joi.string().optional(),
})
