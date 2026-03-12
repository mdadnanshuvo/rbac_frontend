'use client'

import { useEffect, useState } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { Users, Plus, Search } from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'
import api from '@/lib/api'
import { User } from '@/types'
import {
  cn, getRoleBadgeColor, getStatusColor,
  getInitials, formatDate,
} from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const { can } = usePermission()

  const [users,    setUsers]    = useState<User[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    email:     '',
    password:  '',
    firstName: '',
    lastName:  '',
    role:      'agent',
    managerId: '',
  })

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users')
      setUsers(data.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/users', form)
      toast.success('User created!')
      setShowModal(false)
      setForm({ email: '', password: '', firstName: '', lastName: '', role: 'agent', managerId: '' })
      fetchUsers()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error( 'Failed to create user ' )
    } finally {
      setCreating(false)
    }
  }

  const handleStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/users/${id}`, { status })
      toast.success(`User ${status}`)
      fetchUsers()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filtered = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name.toLowerCase().includes(search.toLowerCase()) ||
    u.last_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedLayout>
      <div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={16} className="text-blue-600" />
            </div>
            <div>
              <h1
                className="text-xl font-semibold text-gray-900"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                Users
              </h1>
              <p className="text-xs text-gray-400">{users.length} total members</p>
            </div>
          </div>

          {can('action:user.create') && (
            <Button onClick={() => setShowModal(true)}>
              <Plus size={15} /> Add User
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl
              text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none
              focus:border-brand-orange focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Users size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['User', 'Role', 'Status', 'Manager', 'Joined', 'Actions'].map(h => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <tr
                      key={user.id}
                      className={cn(
                        'hover:bg-gray-50/50 transition-colors',
                        i !== filtered.length - 1 && 'border-b border-gray-50'
                      )}
                    >
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
                          >
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-[11px] text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <span className={cn(
                          'text-[11px] px-2 py-0.5 rounded-full border font-medium capitalize',
                          getRoleBadgeColor(user.role)
                        )}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={cn(
                          'text-[11px] px-2 py-0.5 rounded-full font-medium capitalize',
                          getStatusColor(user.status)
                        )}>
                          {user.status}
                        </span>
                      </td>

                      {/* Manager */}
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {user.manager_email ?? <span className="text-gray-200">—</span>}
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {can('action:user.edit') && (
                          <div className="flex items-center gap-1.5">
                            {user.status === 'active' && (
                              <button
                                onClick={() => handleStatus(user.id, 'suspended')}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors font-medium"
                              >
                                Suspend
                              </button>
                            )}
                            {user.status === 'suspended' && (
                              <button
                                onClick={() => handleStatus(user.id, 'active')}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors font-medium"
                              >
                                Activate
                              </button>
                            )}
                            {user.status !== 'banned' && (
                              <button
                                onClick={() => handleStatus(user.id, 'banned')}
                                className="text-[11px] px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-medium"
                              >
                                Ban
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Create New User"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                required
                value={form.firstName}
                onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
              />
              <Input
                label="Last Name"
                required
                value={form.lastName}
                onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
              />
            </div>

            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />

            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role
              </label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm
                  bg-white focus:outline-none focus:border-brand-orange focus:ring-2
                  focus:ring-orange-100 transition-all"
              >
                <option value="agent">Agent</option>
                <option value="manager">Manager</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={creating}
              >
                Create User
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  )
}