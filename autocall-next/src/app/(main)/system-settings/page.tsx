import AppSettingsManagement from "@/components/features/app-setting/AppSettingsManagement"
import { Suspense } from "react"

const SettingsPage = () => {
  return (
    <Suspense fallback={null}>
      <AppSettingsManagement />
    </Suspense>
  )
}

export default SettingsPage
