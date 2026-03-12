import { useAuthStore } from '@/store/auth.store'

export function usePermission() {
  const { user, hasPermission } = useAuthStore()

  const can = (atom: string) => hasPermission(atom)

  const canAny = (...atoms: string[]) =>
    atoms.some(atom => hasPermission(atom))

  const canAll = (...atoms: string[]) =>
    atoms.every(atom => hasPermission(atom))

  const isRole = (role: string) => user?.role === role

  const isAnyRole = (...roles: string[]) =>
    roles.some(role => user?.role === role)

  return { can, canAny, canAll, isRole, isAnyRole, user }
}