import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ApplicationDashboard } from "@/components/application-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <ApplicationDashboard />
      </main>
      <Footer />
    </div>
  )
}
