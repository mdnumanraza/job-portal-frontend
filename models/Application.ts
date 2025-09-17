import mongoose, { type Document, Schema } from "mongoose"

export interface IApplication extends Document {
  _id: string
  jobId: mongoose.Types.ObjectId
  applicantId: mongoose.Types.ObjectId
  status: "applied" | "under review" | "accepted" | "rejected"
  coverLetter?: string
  resume?: string
  appliedAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "under review", "accepted", "rejected"],
      default: "applied",
    },
    coverLetter: {
      type: String,
      maxlength: [1000, "Cover letter cannot exceed 1000 characters"],
    },
    resume: String,
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate applications
ApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true })
ApplicationSchema.index({ applicantId: 1 })
ApplicationSchema.index({ jobId: 1 })
ApplicationSchema.index({ status: 1 })

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)
