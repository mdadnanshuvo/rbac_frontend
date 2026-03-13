'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Target, CheckSquare,
  BarChart2, FileText, ShieldCheck, MessageSquare,
  ChevronDown, LogOut, HelpCircle, Settings,
  Menu, X, Zap,
  UserCircle2,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { usePermission } from '@/hooks/usePermission'
import { cn, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  atom: string
  badge?: number
  children?: { label: string; href: string }[]
}

const MAIN_NAV: NavItem[] = [
  { label: 'Dashboard',     href: '/dashboard',     icon: <LayoutDashboard size={15} />, atom: 'page:dashboard' },
  { label: 'Leads',         href: '/leads',          icon: <Target size={15} />,          atom: 'page:leads' },
  { label: 'Opportunities', href: '/opportunities',  icon: <Zap size={15} />,             atom: 'page:leads' },
  {
    label: 'Tasks', href: '/tasks', icon: <CheckSquare size={15} />, atom: 'page:tasks',
    children: [
      { label: 'Assignments', href: '/tasks/assignments' },
      { label: 'Calendar',    href: '/tasks/calendar' },
      { label: 'Reminders',   href: '/tasks/reminders' },
    ],
  },
  { label: 'Reports', href: '/reports', icon: <BarChart2 size={15} />, atom: 'page:reports' },
]



const USERS_NAV: NavItem[] = [
  { label: 'Contacts', href: '/users',    icon: <Users size={15} />,         atom: 'page:users', badge: 0 },
  { label: 'Messages', href: '/messages', icon: <MessageSquare size={15} />, atom: 'page:dashboard', badge: 6 },
  { label: 'Configuration',   href: '/permissions',      icon: <ShieldCheck size={15} />,  atom: 'action:permission.view' },
  { label: 'Audit Log',       href: '/audit',            icon: <FileText size={15} />,     atom: 'page:audit' },
  { label: 'Customer Portal', href: '/customer-portal',  icon: <UserCircle2 size={15} />,  atom: 'page:customer-portal' },
]

const OTHER_NAV: NavItem[] = [
  { label: 'Configuration', href: '/permissions', icon: <ShieldCheck size={15} />, atom: 'action:permission.view' },
  { label: 'Audit Log',     href: '/audit',       icon: <FileText size={15} />,    atom: 'page:audit' },
]

const BOTTOM_NAV = [
  { label: 'Help center', href: '/help',     icon: <HelpCircle size={15} /> },
  { label: 'Settings',    href: '/settings', icon: <Settings size={15} /> },
]

export default function Sidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { user, logout } = useAuthStore()
  const { can }   = usePermission()
  const [expanded, setExpanded]       = useState<string | null>('Tasks')
  const [mobileOpen, setMobileOpen]   = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const NavGroup = ({
    title,
    items,
  }: {
    title?: string
    items: NavItem[]
  }) => {
    const visible = items.filter(i => can(i.atom))
    if (!visible.length) return null

    return (
      <div className="mb-2">
        {title && (
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {title}
          </p>
        )}
        {visible.map(item => {
          const isActive     = pathname === item.href || pathname.startsWith(item.href + '/')
          const hasChildren  = !!item.children?.length
          const isExpanded   = expanded === item.label

          return (
            <div key={item.href}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    setExpanded(isExpanded ? null : item.label)
                  } else {
                    router.push(item.href)
                    setMobileOpen(false)
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group',
                  isActive
                    ? 'bg-sidebar-active text-sidebar-textActive font-medium'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive'
                )}
              >
                <span className={cn(
                  'transition-colors flex-shrink-0',
                  isActive ? 'text-brand-orange' : 'text-gray-400 group-hover:text-gray-600'
                )}>
                  {item.icon}
                </span>

                <span className="flex-1 text-left">{item.label}</span>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-bold bg-brand-orange text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}

                {hasChildren && (
                  <ChevronDown
                    size={13}
                    className={cn(
                      'text-gray-400 transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                  />
                )}
              </button>

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="ml-6 mt-0.5 mb-1 border-l border-gray-100 pl-3 space-y-0.5">
                  {item.children!.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block py-1.5 px-2 text-sm rounded-md transition-colors',
                        pathname === child.href
                          ? 'text-brand-orange font-medium'
                          : 'text-gray-400 hover:text-gray-700'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Workspace header */}
      <div className="px-3 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-sidebar-hover cursor-pointer transition-colors">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
          >
            O
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Johns workspace</p>
            <p className="text-[10px] text-gray-400 truncate">#W1246483</p>
          </div>
          <ChevronDown size={13} className="text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <NavGroup items={MAIN_NAV} />
        <NavGroup title="Users"  items={USERS_NAV} />
        <NavGroup title="Other"  items={OTHER_NAV} />
      </div>

      {/* Bottom links */}
      <div className="border-t border-sidebar-border px-2 py-3 space-y-0.5">
        {BOTTOM_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-sidebar-hover hover:text-gray-700 transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* User row */}
        <div className="mt-2 pt-2 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors cursor-pointer group">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
            >
              {user ? getInitials(user.firstName, user.lastName) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-[10px] text-gray-400 capitalize truncate">
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 hover:text-red-500 text-gray-400"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-card border border-gray-100"
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'sidebar-transition fixed top-0 left-0 h-full z-40 w-56',
        'bg-sidebar-bg border-r border-sidebar-border',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0'
      )}>
        <SidebarContent />
      </aside>
    </>
  )
}