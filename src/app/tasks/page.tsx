'use client'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { CheckSquare } from 'lucide-react'

export default function TasksPage() {
  return (
    <ProtectedLayout>
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <CheckSquare size={16} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>Tasks</h1>
          <p className="text-xs text-gray-400">Assignments, calendar and reminders</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-card flex items-center justify-center h-64">
        <p className="text-sm text-gray-300">Tasks module — coming soon</p>
      </div>
    </ProtectedLayout>
  )
}