import mongoose, { type Document, Schema } from "mongoose"

export interface IJob extends Document {
  _id: string
  title: string
  description: string
  requirements: string[]
  location: string
  category: "imam" | "teacher" | "tutor" | "helper"
  salary: number | "Not disclosed"
  jobType: "full-time" | "part-time" | "contract" | "remote"
  postedBy: mongoose.Types.ObjectId
  status: "active" | "closed" | "draft"
  applicationsCount: number
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    requirements: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["imam", "teacher", "tutor", "helper"],
    },
    salary: {
      type: Schema.Types.Mixed,
      validate: {
        validator: (value: any) => typeof value === "number" || value === "Not disclosed",
        message: 'Salary must be a number or "Not disclosed"',
      },
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["full-time", "part-time", "contract", "remote"],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
JobSchema.index({ category: 1 })
JobSchema.index({ location: 1 })
JobSchema.index({ status: 1 })
JobSchema.index({ postedBy: 1 })
JobSchema.index({ createdAt: -1 })
JobSchema.index({ title: "text", description: "text" })

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)
