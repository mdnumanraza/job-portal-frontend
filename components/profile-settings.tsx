"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { User } from "@/lib/data"
import { UserIcon, Mail, MapPin, GraduationCap, Briefcase, Plus, X } from "lucide-react"

interface ProfileSettingsProps {
  user: User | undefined
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.profile?.location || "",
    experience: user?.profile?.experience || "",
    education: user?.profile?.education || "",
    skills: user?.profile?.skills || [],
  })

  const [newSkill, setNewSkill] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSave = () => {
    // Here you would typically save the profile data to your backend
    console.log("Profile updated:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      location: user?.profile?.location || "",
      experience: user?.profile?.experience || "",
      education: user?.profile?.education || "",
      skills: user?.profile?.skills || [],
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center p-3 bg-muted rounded-md">
                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formData.name || "Not provided"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center p-3 bg-muted rounded-md">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formData.email || "Not provided"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location"
              />
            ) : (
              <div className="flex items-center p-3 bg-muted rounded-md">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formData.location || "Not provided"}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience</Label>
            {isEditing ? (
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Describe your work experience..."
                rows={4}
              />
            ) : (
              <div className="flex items-start p-3 bg-muted rounded-md">
                <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{formData.experience || "Not provided"}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            {isEditing ? (
              <Textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Describe your educational background..."
                rows={3}
              />
            ) : (
              <div className="flex items-start p-3 bg-muted rounded-md">
                <GraduationCap className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{formData.education || "Not provided"}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <Button type="button" onClick={handleAddSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No skills added</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive updates about your applications</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              Configure
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Privacy Settings</h4>
              <p className="text-sm text-muted-foreground">Control who can see your profile</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              Manage
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
