'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuthStore } from '@/store/auth.store'
import Spinner from '@/components/ui/Spinner'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { fetchMe, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    fetchMe().then(() => {
      const state = useAuthStore.getState()
      if (!state.isAuthenticated) {
        router.push('/login')
      }
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-subtle">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-subtle flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-56 min-h-screen">
        <Header />
        <main className="flex-1 p-6 lg:p-8 page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}
