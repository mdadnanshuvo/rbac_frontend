'use client'

import { useEffect, useState } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { FileText, Search } from 'lucide-react'
import api from '@/lib/api'
import { AuditLog } from '@/types'
import { cn, getInitials, formatDateTime, getActionColor } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function AuditPage() {
  const [logs,    setLogs]    = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    api.get('/audit', { params: { limit: 100 } })
      .then(({ data }) => setLogs(data.data))
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = logs.filter(l =>
    !search ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.actor_email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedLayout>
      <div>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <FileText size={16} className="text-emerald-600" />
          </div>
          <div>
            <h1
              className="text-xl font-semibold text-gray-900"
              style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            >
              Audit Log
            </h1>
            <p className="text-xs text-gray-400">
              Append-only trail of all system actions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by action or actor…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl
              text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none
              focus:border-brand-orange focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        {/* Log list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400">No audit events yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(log => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center
                      text-white text-[11px] font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #FF6B3D, #F04E1F)' }}
                  >
                    {log.first_name
                      ? getInitials(log.first_name, log.last_name)
                      : '?'
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">
                        {log.actor_email || 'System'}
                      </span>
                      <span className={cn(
                        'text-[11px] px-2 py-0.5 rounded-full font-medium',
                        getActionColor(log.action)
                      )}>
                        {log.action}
                      </span>
                      {log.target_type && (
                        <span className="text-xs text-gray-400">
                          on <span className="text-gray-500">{log.target_type}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                      {log.ip_address}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5">
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </ProtectedLayout>
  )
}