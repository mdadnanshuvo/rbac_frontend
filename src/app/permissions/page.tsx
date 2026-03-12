'use client'

import { useEffect, useState } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { ShieldCheck, Search, Check } from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'
import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/api'
import { User, Permission } from '@/types'
import { cn, getInitials, getRoleBadgeColor } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function PermissionsPage() {
  const { can, user: currentUser } = usePermission()

  const [users,        setUsers]        = useState<User[]>([])
  const [allPerms,     setAllPerms]     = useState<Permission[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userPerms,    setUserPerms]    = useState<string[]>([])
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [search,       setSearch]       = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/permissions'),
    ]).then(([usersRes, permsRes]) => {
      setUsers(usersRes.data.data)
      setAllPerms(permsRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const selectUser = async (user: User) => {
    setSelectedUser(user)
    try {
      const { data } = await api.get(`/permissions/user/${user.id}`)
      setUserPerms(data.data.map((p: any) => p.atom))
    } catch {
      setUserPerms([])
    }
  }

  const togglePerm = (atom: string) => {
    if (!can('action:permission.grant')) return

    // Grant ceiling — can only grant perms you hold
    if (!currentUser?.permissions.includes(atom)) {
      toast.error("You don't hold this permission — can't grant it")
      return
    }

    setUserPerms(prev =>
      prev.includes(atom)
        ? prev.filter(p => p !== atom)
        : [...prev, atom]
    )
  }

  const savePermissions = async () => {
    if (!selectedUser) return
    setSaving(true)
    try {
      await api.put(`/permissions/user/${selectedUser.id}/sync`, {
        atoms: userPerms,
      })
      toast.success('Permissions saved!')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name.toLowerCase().includes(search.toLowerCase())
  )

  const groupedPerms = {
    Pages:   allPerms.filter(p => p.atom.startsWith('page:')),
    Actions: allPerms.filter(p => p.atom.startsWith('action:')),
  }

  return (
    <ProtectedLayout>
      <div>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <ShieldCheck size={16} className="text-purple-600" />
          </div>
          <div>
            <h1
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Permissions
            </h1>
            <p className="text-xs text-gray-400">
              Configure per-user access atoms
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── User list ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users…"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-lg text-sm
                    text-gray-700 placeholder:text-gray-300 focus:outline-none
                    focus:ring-2 focus:ring-orange-100 transition-all border-0"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner />
                </div>
              ) : filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    'border-b border-gray-50 last:border-0',
                    selectedUser?.id === user.id
                      ? 'bg-orange-50'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
                  >
                    {getInitials(user.first_name, user.last_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-full border font-medium capitalize',
                      getRoleBadgeColor(user.role)
                    )}>
                      {user.role}
                    </span>
                  </div>
                  {selectedUser?.id === user.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Permission editor ── */}
          <div className="lg:col-span-2">
            {!selectedUser ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-card
                flex items-center justify-center min-h-[300px]">
                <div className="text-center text-gray-300">
                  <ShieldCheck size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Select a user to manage permissions</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">

                {/* Editor header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
                    >
                      {getInitials(selectedUser.first_name, selectedUser.last_name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </p>
                      <p className="text-xs text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>

                  {can('action:permission.grant') && (
                    <Button onClick={savePermissions} loading={saving} size="sm">
                      Save Changes
                    </Button>
                  )}
                </div>

                {/* Permission groups */}
                <div className="p-5 space-y-6">
                  {Object.entries(groupedPerms).map(([group, perms]) => (
                    <div key={group}>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {group}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {perms.map(perm => {
                          const granted   = userPerms.includes(perm.atom)
                          const canGrant  = currentUser?.permissions.includes(perm.atom)

                          return (
                            <button
                              key={perm.id}
                              onClick={() => togglePerm(perm.atom)}
                              disabled={!can('action:permission.grant') || !canGrant}
                              className={cn(
                                'flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-all',
                                granted
                                  ? 'bg-orange-50 border-orange-200'
                                  : 'bg-gray-50 border-gray-100 hover:border-gray-200',
                                (!can('action:permission.grant') || !canGrant) &&
                                  'opacity-50 cursor-not-allowed'
                              )}
                            >
                              {/* Checkbox */}
                              <div className={cn(
                                'w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all',
                                granted
                                  ? 'bg-brand-orange'
                                  : 'bg-white border border-gray-300'
                              )}>
                                {granted && (
                                  <Check size={11} className="text-white" strokeWidth={3} />
                                )}
                              </div>

                              {/* Label */}
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'text-xs font-medium',
                                  granted ? 'text-orange-700' : 'text-gray-600'
                                )}>
                                  {perm.label}
                                </p>
                                <p className="text-[10px] text-gray-400 font-mono truncate">
                                  {perm.atom}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}