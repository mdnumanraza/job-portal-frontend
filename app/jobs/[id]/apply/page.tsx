import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JobApplicationForm } from "@/components/job-application-form"
import { getJobById } from "@/lib/data"

interface JobApplicationPageProps {
  params: {
    id: string
  }
}

export default function JobApplicationPage({ params }: JobApplicationPageProps) {
  const job = getJobById(params.id)

  if (!job) {
    notFound()
  }

  if (job.applicationStatus !== "open") {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <JobApplicationForm job={job} />
      </main>
      <Footer />
    </div>
  )
}
