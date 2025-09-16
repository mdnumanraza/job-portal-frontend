"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, CheckCircle } from "lucide-react"
import type { Job } from "@/lib/data"
import { useLanguage } from "@/hooks/use-language"

interface JobApplicationFormProps {
  job: Job
}

export function JobApplicationForm({ job }: JobApplicationFormProps) {
  const { t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    experience: "",
    education: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the application data to your backend
    console.log("Application submitted:", { jobId: job.id, ...formData })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for applying to <strong>{job.title}</strong> at {job.employer}. We have received your
                application and will review it shortly.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/dashboard">View My Applications</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/jobs/${job.id}`} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common", "back")} to Job Details
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Apply for {job.title}</CardTitle>
              <p className="text-muted-foreground">Fill out the form below to submit your application.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your relevant work experience..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education Background</Label>
                  <Textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="Describe your educational background..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    required
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop your resume</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (max 5MB)</p>
                    <Button type="button" variant="outline" className="mt-3 bg-transparent">
                      Choose File
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-card-foreground mb-2">{job.title}</h4>
                <p className="text-sm text-muted-foreground">{job.employer}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="text-card-foreground">{job.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-card-foreground capitalize">{job.type.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="text-card-foreground">{job.salary}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{t("jobs", job.category.replace(" ", ""))}</Badge>
                <Badge variant="outline">
                  {job.type === "full-time"
                    ? t("jobs", "fullTime")
                    : job.type === "part-time"
                      ? t("jobs", "partTime")
                      : t("jobs", "remote")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Tailor your cover letter to this specific position</li>
                <li>• Highlight relevant Islamic knowledge and experience</li>
                <li>• Ensure your resume is up-to-date and professional</li>
                <li>• Double-check all information before submitting</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
