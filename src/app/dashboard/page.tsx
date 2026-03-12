'use client'

import { useAuthStore } from '@/store/auth.store'
import {
  LayoutDashboard, Users, ShieldCheck,
  FileText, Activity, TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    {
      label: 'Total Users',
      value: '—',
      icon: <Users size={18} />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Agents',
      value: '—',
      icon: <Activity size={18} />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Permissions Set',
      value: '—',
      icon: <ShieldCheck size={18} />,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Audit Events',
      value: '—',
      icon: <FileText size={18} />,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  const quickActions = [
    {
      label: 'Manage Users',
      desc:  'Create, edit, suspend users',
      href:  '/users',
      color: '#F04E1F',
    },
    {
      label: 'Configure Permissions',
      desc:  'Grant or revoke access atoms',
      href:  '/permissions',
      color: '#6366F1',
    },
    {
      label: 'View Audit Log',
      desc:  'See all system activity',
      href:  '/audit',
      color: '#10B981',
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-brand-orange" />
          </div>
          <h1
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            Dashboard
          </h1>
        </div>
        <p className="text-sm text-gray-400 ml-10">
          Welcome back,{' '}
          <span className="text-gray-600 font-medium">{user?.firstName}</span> 👋
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-card hover:shadow-card-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-0.5">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Permissions card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-0.5">
              Your Access Level
            </h2>
            <p className="text-xs text-gray-400">
              Permissions granted to your account
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize border bg-amber-50 text-amber-700 border-amber-200">
            {user?.role}
          </span>
        </div>

        {user?.permissions?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.permissions.map(atom => (
              <span
                key={atom}
                className="text-[11px] px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 font-mono"
              >
                {atom}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No permissions assigned yet.</p>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions.map(action => (
          <Link
            key={action.label}
            href={action.href}
            className="group bg-white rounded-xl border border-gray-100 shadow-card p-4 hover:shadow-card-md transition-all hover:-translate-y-0.5"
          >
            <div
              className="w-2 h-2 rounded-full mb-3"
              style={{ background: action.color }}
            />
            <p className="text-sm font-medium text-gray-800 mb-0.5 group-hover:text-gray-900">
              {action.label}
            </p>
            <p className="text-xs text-gray-400 mb-3">{action.desc}</p>
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: action.color }}>
              Open <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}