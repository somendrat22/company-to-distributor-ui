'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission } from '@/lib/permissions'

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

/**
 * Component that conditionally renders children based on user permissions
 * 
 * Usage:
 * <PermissionGuard permission="USER_CREATE">
 *   <Button>Invite Employee</Button>
 * </PermissionGuard>
 * 
 * <PermissionGuard permissions={["PRODUCT_CREATE", "PRODUCT_UPDATE"]} requireAll={false}>
 *   <Button>Manage Products</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuth()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(user, permission)
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(user, permissions)
      : hasAnyPermission(user, permissions)
  } else {
    // No permission specified, render children by default
    hasAccess = true
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
