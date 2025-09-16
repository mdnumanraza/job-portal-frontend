"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Minus } from "lucide-react"

interface PostJobFormProps {
  onClose: () => void
  employerId: string
}

export function PostJobForm({ onClose, employerId }: PostJobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    type: "",
    salary: "",
    description: "",
    requirements: [""],
    featured: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData((prev) => ({
      ...prev,
      requirements: newRequirements,
    }))
  }

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }))
  }

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        requirements: newRequirements,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the job data to your backend
    console.log("Job posted:", { ...formData, employerId })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Post New Job</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Imam - Community Mosque"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imam">Imam</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="helper">Helper</SelectItem>
                    <SelectItem value="online tutor">Online Tutor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range *</Label>
              <Input
                id="salary"
                name="salary"
                required
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g., $45,000 - $55,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Requirements *</Label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    required
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      className="bg-transparent"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="bg-transparent">
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked as boolean }))}
              />
              <Label htmlFor="featured" className="text-sm">
                Make this a featured job posting (+$50)
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Post Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
