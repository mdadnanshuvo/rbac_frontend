'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/users':       'Users',
  '/permissions': 'Permissions',
  '/audit':       'Audit Log',
  '/reports':     'Reports',
  '/leads':       'Leads',
  '/tasks':       'Tasks',
  '/settings':    'Settings',
}

export default function Header() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const title = PAGE_TITLES[pathname] ?? 'Obliq'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">

      {/* Left — page title */}
      <h2
        className="text-base font-semibold text-gray-800 ml-8 lg:ml-0"
        style={{ fontFamily: 'Fraunces, Georgia, serif' }}
      >
        {title}
      </h2>

      {/* Right — search + notifications + avatar */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-48 group focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <Search size={13} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-300 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-orange rounded-full" />
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
          title={user?.email}
        >
          {user ? getInitials(user.firstName, user.lastName) : 'U'}
        </div>
      </div>
    </header>
  )
}