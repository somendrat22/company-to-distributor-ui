'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  UserPlus,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  Building2
} from 'lucide-react'
import { 
  canViewProducts, 
  canViewSalesOrders, 
  canViewPayments, 
  canInviteEmployee 
} from '@/lib/permissions'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: (user: any) => boolean
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    permission: canViewProducts,
  },
  {
    name: 'Sales Orders',
    href: '/sales',
    icon: ShoppingCart,
    permission: canViewSalesOrders,
  },
  {
    name: 'Payments',
    href: '/payments',
    icon: CreditCard,
    permission: canViewPayments,
  },
  {
    name: 'Employees',
    href: '/employees/invite',
    icon: Users,
    permission: canInviteEmployee,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isPinned, setIsPinned] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load pinned state from localStorage
  useEffect(() => {
    const savedPinState = localStorage.getItem('sidebarPinned')
    if (savedPinState !== null) {
      setIsPinned(savedPinState === 'true')
    }
  }, [])

  // Save pinned state to localStorage
  const togglePin = () => {
    const newPinState = !isPinned
    setIsPinned(newPinState)
    localStorage.setItem('sidebarPinned', String(newPinState))
  }

  // Determine if sidebar should be expanded
  const isExpanded = isPinned || isHovered

  // Filter navigation items based on permissions and search
  const filteredItems = navigationItems.filter(item => {
    // Check permission
    if (item.permission && user && !item.permission(user)) {
      return false
    }
    // Check search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-40 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => !isPinned && setIsHovered(true)}
      onMouseLeave={() => !isPinned && setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className={`flex items-center gap-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {user?.company?.companyLogoUrl ? (
              <img
                src={user.company.companyLogoUrl}
                alt={user.company.companyName}
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            {isExpanded && (
              <span className="font-semibold text-sm truncate">
                {user?.company?.companyName || 'Portal'}
              </span>
            )}
          </div>
          {!isExpanded && (
            <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center mx-auto">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Pin/Unpin Button */}
        <div className="px-4 py-2 border-b border-gray-800">
          <button
            onClick={togglePin}
            className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
            title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            {isPinned ? (
              <PinOff className="w-5 h-5" />
            ) : (
              <Pin className="w-5 h-5" />
            )}
            {isExpanded && (
              <span className="text-sm">
                {isPinned ? 'Unpin' : 'Pin'} Sidebar
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        {isExpanded && (
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer - User Info */}
        {user && (
          <div className="border-t border-gray-800 p-4">
            <div className={`flex items-center gap-3 ${isExpanded ? '' : 'justify-center'}`}>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expand/Collapse Indicator (when not pinned) */}
        {!isPinned && (
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
            <div className="bg-gray-800 rounded-full p-1 shadow-lg">
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
