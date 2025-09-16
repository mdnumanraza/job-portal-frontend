import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JobList } from "@/components/job-list"

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Job Listings</h1>
            <p className="text-muted-foreground">
              Discover meaningful career opportunities in Islamic education and community service
            </p>
          </div>
          <JobList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
