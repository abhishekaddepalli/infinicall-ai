import LandingPageSetup from "@/components/features/landing-page-setup/LandingPageSetup"
import { Suspense } from "react"

const Page = () => {
  return (
    <Suspense fallback={null}>
      <LandingPageSetup />
    </Suspense>
  )
}

export default Page
