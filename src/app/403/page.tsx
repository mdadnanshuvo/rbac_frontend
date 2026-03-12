'use client'

import Link from 'next/link'
import { ShieldOff } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-surface-subtle flex items-center justify-center p-4">
      <div className="text-center max-w-sm">

        {/* Icon */}
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldOff size={28} className="text-red-400" />
        </div>

        {/* Text */}
        <h1
          className="text-2xl font-semibold text-gray-800 mb-2"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          Access Denied
        </h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          You don&apos;t have permission to view this page.
          Contact your manager to request access.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="btn-press inline-flex items-center px-5 py-2.5 rounded-xl
              text-white text-sm font-medium transition-all"
            style={{
              background:  'linear-gradient(135deg, #FF6B3D, #F04E1F)',
              boxShadow:   '0 2px 8px rgba(240,78,31,0.30)',
            }}
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200
              text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}


