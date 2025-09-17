import mongoose, { type Document, Schema } from "mongoose"

export interface IJob extends Document {
  _id: string
  title: string
  description: string
  requirements: string[]
  location: string
  category: "imam" | "teacher" | "tutor" | "helper"
  jobType: "full-time" | "part-time" | "contract" | "remote"
  salary: number | "Not disclosed"
  postedBy: mongoose.Types.ObjectId
  status: "active" | "closed" | "draft"
  applicationsCount: number
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["imam", "teacher", "tutor", "helper"],
      required: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "remote"],
      required: true,
    },
    salary: {
      type: Schema.Types.Mixed,
      required: true,
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
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
JobSchema.index({ category: 1 })
JobSchema.index({ location: 1 })
JobSchema.index({ status: 1 })
JobSchema.index({ postedBy: 1 })
JobSchema.index({ createdAt: -1 })

export default mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)
