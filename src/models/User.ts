import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  role: "applicant" | "employer" | "admin"
  phone?: string
  location?: string
  organization?: string
  skills?: string[]
  education?: {
    degree: string
    institution: string
    year: number
  }[]
  experience?: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  resume?: string
  profileImage?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["applicant", "employer", "admin"],
      default: "applicant",
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        degree: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
      },
    ],
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    resume: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
