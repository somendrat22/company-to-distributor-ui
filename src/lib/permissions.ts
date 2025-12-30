import { User, Operation } from '@/types'

// Permission constants
export const PERMISSIONS = {
  // User operations
  USER_CREATE: 'USER_CREATE',
  USER_VIEW: 'USER_VIEW',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_ASSIGN_ROLE: 'USER_ASSIGN_ROLE',
  USER_REVOKE_ROLE: 'USER_REVOKE_ROLE',
  INVITE_EMPLOYEE: 'INVITE_EMPLOYEE',
  
  // Role operations
  CREATE_ROLE: 'CREATE_ROLE',
  VIEW_ROLE: 'VIEW_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE',
  DELETE_ROLE: 'DELETE_ROLE',
  
  // Operation operations
  VIEW_OPERATIONS: 'VIEW_OPERATIONS',
  
  // Company operations
  COMPANY_CREATE: 'COMPANY_CREATE',
  COMPANY_VIEW: 'COMPANY_VIEW',
  COMPANY_UPDATE: 'COMPANY_UPDATE',
  COMPANY_DELETE: 'COMPANY_DELETE',
  COMPANY_ONBOARD: 'COMPANY_ONBOARD',
  COMPANY_VERIFY: 'COMPANY_VERIFY',
  COMPANY_ACTIVATE: 'COMPANY_ACTIVATE',
  COMPANY_DEACTIVATE: 'COMPANY_DEACTIVATE',
  
  // Product operations
  PRODUCT_CREATE: 'PRODUCT_CREATE',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_UPDATE: 'PRODUCT_UPDATE',
  PRODUCT_DELETE: 'PRODUCT_DELETE',
  PRODUCT_PRICE_UPDATE: 'PRODUCT_PRICE_UPDATE',
  PRODUCT_STOCK_UPDATE: 'PRODUCT_STOCK_UPDATE',
  PRODUCT_BULK_UPLOAD: 'PRODUCT_BULK_UPLOAD',
  
  // Purchase Order operations
  PO_CREATE: 'PO_CREATE',
  PO_VIEW: 'PO_VIEW',
  PO_UPDATE: 'PO_UPDATE',
  PO_CANCEL: 'PO_CANCEL',
  PO_APPROVE: 'PO_APPROVE',
  PO_REJECT: 'PO_REJECT',
  PO_CLOSE: 'PO_CLOSE',
  
  // Sales Order operations
  SO_CREATE: 'SO_CREATE',
  SO_VIEW: 'SO_VIEW',
  SO_UPDATE: 'SO_UPDATE',
  SO_CANCEL: 'SO_CANCEL',
  SO_DISPATCH: 'SO_DISPATCH',
  SO_DELIVER: 'SO_DELIVER',
  
  // Inventory operations
  INVENTORY_VIEW: 'INVENTORY_VIEW',
  INVENTORY_ADD_STOCK: 'INVENTORY_ADD_STOCK',
  INVENTORY_REMOVE_STOCK: 'INVENTORY_REMOVE_STOCK',
  INVENTORY_ADJUSTMENT: 'INVENTORY_ADJUSTMENT',
  INVENTORY_TRANSFER: 'INVENTORY_TRANSFER',
  
  // Payment operations
  PAYMENT_INITIATE: 'PAYMENT_INITIATE',
  PAYMENT_RECEIVE: 'PAYMENT_RECEIVE',
  PAYMENT_REFUND: 'PAYMENT_REFUND',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

/**
 * Get all operations from user's roles
 */
export function getUserOperations(user: User | null): Operation[] {
  if (!user || !user.roles) return []
  
  const allOperations: Operation[] = []
  user.roles.forEach(role => {
    if (role.operations) {
      allOperations.push(...role.operations)
    }
  })
  
  // Remove duplicates based on sys_id
  const uniqueOperations = allOperations.filter((op, index, self) =>
    index === self.findIndex(o => o.sys_id === op.sys_id)
  )
  
  return uniqueOperations
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  
  const operations = getUserOperations(user)
  return operations.some(op => op.operationName === permission)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  
  return permissions.some(permission => hasPermission(user, permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  
  return permissions.every(permission => hasPermission(user, permission))
}

/**
 * Get permissions by operation type
 */
export function getPermissionsByType(user: User | null, operationType: string): Operation[] {
  if (!user) return []
  
  const operations = getUserOperations(user)
  return operations.filter(op => op.operationType === operationType)
}

/**
 * Check if user can invite employees (needs INVITE_EMPLOYEE permission)
 */
export function canInviteEmployee(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.INVITE_EMPLOYEE)
}

/**
 * Check if user can create roles (needs CREATE_ROLE permission)
 */
export function canCreateRole(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.CREATE_ROLE)
}

/**
 * Check if user can view roles (needs VIEW_ROLE permission)
 */
export function canViewRoles(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_ROLE)
}

/**
 * Check if user can view operations (needs VIEW_OPERATIONS permission)
 */
export function canViewOperations(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_OPERATIONS)
}

/**
 * Check if user can manage roles (needs USER_ASSIGN_ROLE permission)
 */
export function canManageRoles(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.USER_ASSIGN_ROLE)
}

/**
 * Check if user can view users
 */
export function canViewUsers(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.USER_VIEW)
}

/**
 * Sales Order permissions
 */
export function canViewSalesOrders(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SO_VIEW)
}

export function canCreateSalesOrder(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SO_CREATE)
}

export function canUpdateSalesOrder(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SO_UPDATE)
}

export function canCancelSalesOrder(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SO_CANCEL)
}

export function canDispatchSalesOrder(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SO_DISPATCH)
}

export function canDeliverSalesOrder(user: User | null): boolean {
  return hasPermission(user, PERMISSIONS.SO_DELIVER)
}

/**
 * Check if user can manage products
 */
export function canManageProducts(user: User | null): boolean {
  return hasAnyPermission(user, [
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
  ])
}

/**
 * Check if user can manage inventory
 */
export function canManageInventory(user: User | null): boolean {
  return hasAnyPermission(user, [
    PERMISSIONS.INVENTORY_ADD_STOCK,
    PERMISSIONS.INVENTORY_REMOVE_STOCK,
    PERMISSIONS.INVENTORY_ADJUSTMENT,
    PERMISSIONS.INVENTORY_TRANSFER,
  ])
}

/**
 * Check if user can manage orders
 */
export function canManageOrders(user: User | null): boolean {
  return hasAnyPermission(user, [
    PERMISSIONS.PO_CREATE,
    PERMISSIONS.SO_CREATE,
  ])
}
