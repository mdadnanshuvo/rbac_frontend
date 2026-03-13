'use client'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Settings size={16} className="text-gray-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Settings</h1>
          <p className="text-xs text-gray-400">System configuration</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-card flex items-center justify-center h-64">
        <p className="text-sm text-gray-300">Settings module — coming soon</p>
      </div>
    </ProtectedLayout>
  )
}