export type Role = 'admin' | 'manager' | 'agent' | 'customer'

export type UserStatus = 'active' | 'suspended' | 'banned'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: Role
  status: UserStatus
  manager_id: string | null
  manager_email?: string
  created_at: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  permissions: string[]
}

export interface Permission {
  id: number
  atom: string
  label: string
  description: string
  created_at: string
}

export interface UserPermission {
  id: number
  atom: string
  label: string
  granted_by: string
  granted_at: string
}

export interface AuditLog {
  id: string
  actor_id: string
  actor_email: string
  first_name: string
  last_name: string
  action: string
  target_type: string
  target_id: string
  metadata: Record<string, unknown>
  ip_address: string
  created_at: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CreateUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
  managerId?: string
}