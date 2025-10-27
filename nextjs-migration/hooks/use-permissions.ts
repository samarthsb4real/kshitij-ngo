'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/auth'

type Permission = 
  | 'canSubmitForm'
  | 'canUpdateStatus'
  | 'canEditData'
  | 'canViewDashboard'
  | 'canViewStudents'

const PERMISSIONS = {
  canSubmitForm: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'],
  canUpdateStatus: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'],
  canEditData: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni'],
  canViewDashboard: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'],
  canViewStudents: ['admin', 'umamane', 'ajaymane', 'avdhutkulkarni', 'viewer'],
}

export function usePermissions() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return PERMISSIONS[permission].includes(user.role)
  }

  const isAdmin = user?.role === 'admin'
  const isViewer = user?.role === 'viewer'
  const canEdit = hasPermission('canEditData')

  return {
    user,
    loading,
    hasPermission,
    isAdmin,
    isViewer,
    canEdit,
    canSubmitForm: hasPermission('canSubmitForm'),
    canUpdateStatus: hasPermission('canUpdateStatus'),
  }
}
