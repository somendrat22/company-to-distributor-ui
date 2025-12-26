'use client'

import React from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Building2, LogOut, User, Shield, Package, UserPlus } from 'lucide-react'
import Image from 'next/image'
import { canInviteEmployee } from '@/lib/permissions'

function DashboardContent() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Company Logo */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {user.company?.companyLogoUrl ? (
                <img
                  src={user.company.companyLogoUrl}
                  alt={user.company.companyName}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {user.company?.companyName || 'Company Portal'}
                </h1>
                <p className="text-xs text-gray-500">{user.company?.companyType}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.fullName}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Quick Actions */}
        {canInviteEmployee(user) && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <Link href="/employees/invite">
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Employee
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">
                    {user.addressLine1}
                    {user.addressLine2 && `, ${user.addressLine2}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Card with Logo */}
          {user.company && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {user.company.companyLogoUrl ? (
                    <img
                      src={user.company.companyLogoUrl}
                      alt={user.company.companyName}
                      className="w-5 h-5 rounded object-cover"
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-primary-600" />
                  )}
                  <CardTitle className="text-lg">Company Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Legal Name</p>
                    <p className="font-medium text-gray-900">{user.company.legalName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Company ID</p>
                    <p className="font-medium text-gray-900 text-xs">{user.company.companyId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {user.company.city}, {user.company.state}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Roles Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-lg">Roles & Permissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.roles.map((role) => (
                  <div key={role.roleId} className="bg-primary-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary-900">{role.roleName}</p>
                    <p className="text-xs text-primary-700 mt-1">
                      {role.operations.length} permissions
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operations Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              <CardTitle>Available Operations</CardTitle>
            </div>
            <CardDescription>
              Operations you have access to based on your roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {user.roles.flatMap(role => role.operations).map((operation) => (
                <div
                  key={operation.sys_id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <p className="text-xs font-medium text-gray-900">{operation.operationName}</p>
                  <p className="text-xs text-gray-500 mt-1">{operation.operationType}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
