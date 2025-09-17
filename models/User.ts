import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  role: "applicant" | "employer" | "admin"
  phone?: string
  location?: string
  avatar?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date

  // Applicant specific fields
  resume?: string
  skills: string[]
  education: {
    degree: string
    institution: string
    year: number
    grade?: string
  }[]
  experience: {
    title: string
    company: string
    duration: string
    description?: string
  }[]

  // Employer specific fields
  companyName?: string
  companyDescription?: string
  website?: string
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["applicant", "employer", "admin"],
      default: "applicant",
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    avatar: String,
    isVerified: {
      type: Boolean,
      default: false,
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
        grade: String,
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
        description: String,
      },
    ],
    companyName: String,
    companyDescription: String,
    website: String,
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ location: 1 })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
