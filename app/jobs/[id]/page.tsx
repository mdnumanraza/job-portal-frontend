import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JobDetailContent } from "@/components/job-detail-content"
import { getJobById } from "@/lib/data"

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = getJobById(params.id)

  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <JobDetailContent job={job} />
      </main>
      <Footer />
    </div>
  )
}
