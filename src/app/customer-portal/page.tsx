'use client'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { UserCircle2, Ticket, ShoppingBag, MessageSquare } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export default function CustomerPortalPage() {
  const { user } = useAuthStore()

  const items = [
    { label: 'My Tickets',  icon: <Ticket size={18} />,       color: 'bg-blue-50 text-blue-600' },
    { label: 'My Orders',   icon: <ShoppingBag size={18} />,  color: 'bg-emerald-50 text-emerald-600' },
    { label: 'My Messages', icon: <MessageSquare size={18} />, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <ProtectedLayout>
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <UserCircle2 size={16} className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Customer Portal
          </h1>
          <p className="text-xs text-gray-400">Your self-service portal</p>
        </div>
      </div>

      {/* Welcome card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6 mb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800">
              Welcome, {user?.firstName}!
            </h2>
            <p className="text-xs text-gray-400">
              Here is your self-service dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Portal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map(item => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-gray-100 shadow-card p-5 hover:shadow-card-md transition-shadow cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">View and manage</p>
          </div>
        ))}
      </div>
    </ProtectedLayout>
  )
}