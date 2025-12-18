'use client'

import { useRouter } from 'next/navigation'
import { Landing } from '@/components/onboarding/steps/Landing'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <Landing onGetStarted={handleGetStarted} />
    </div>
  )
}
