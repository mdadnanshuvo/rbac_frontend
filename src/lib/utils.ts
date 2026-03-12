import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
}

export function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'admin':    return 'bg-red-100 text-red-700 border-red-200'
    case 'manager':  return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'agent':    return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'customer': return 'bg-green-100 text-green-700 border-green-200'
    default:         return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'active':    return 'bg-emerald-100 text-emerald-700'
    case 'suspended': return 'bg-amber-100 text-amber-700'
    case 'banned':    return 'bg-red-100 text-red-700'
    default:          return 'bg-gray-100 text-gray-600'
  }
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  })
}

export function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month:  'short',
    day:    'numeric',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export function getActionColor(action: string) {
  if (action.includes('create')) return 'bg-emerald-100 text-emerald-700'
  if (action.includes('delete')) return 'bg-red-100 text-red-700'
  if (action.includes('update')) return 'bg-blue-100 text-blue-700'
  if (action.includes('grant'))  return 'bg-amber-100 text-amber-700'
  if (action.includes('revoke')) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-600'
}