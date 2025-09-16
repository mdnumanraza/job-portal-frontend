import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EmployerDashboard } from "@/components/employer-dashboard"

export default function EmployerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        <EmployerDashboard />
      </main>
      <Footer />
    </div>
  )
}
