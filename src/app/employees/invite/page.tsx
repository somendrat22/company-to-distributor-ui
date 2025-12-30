'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { fetchCompanyRoles, inviteEmployee, fetchAllOperations, createRole } from '@/lib/api'
import { Role, Operation } from '@/types'
import { UserPlus, Shield, Check, ArrowLeft, AlertCircle, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { canInviteEmployee, canCreateRole } from '@/lib/permissions'
import { CreateRoleModal } from '@/components/employees/CreateRoleModal'

const inviteEmployeeSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  addressLine1: z.string().min(3, 'Address is required'),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
})

type InviteEmployeeFormData = z.infer<typeof inviteEmployeeSchema>

function InviteEmployeeContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [operations, setOperations] = useState<Operation[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set())
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false)
  const [viewingRole, setViewingRole] = useState<Role | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteEmployeeFormData>({
    resolver: zodResolver(inviteEmployeeSchema),
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoadingData(true)
    try {
      const rolesData = await fetchCompanyRoles()
      console.log('Roles fetched:', rolesData)
      setRoles(rolesData)
      console.log('Roles state set:', rolesData.length, 'roles')
      
      // Fetch operations for role creation
      try {
        const opsData = await fetchAllOperations()
        console.log('Operations fetched:', opsData.length, 'operations')
        setOperations(opsData)
      } catch (opsErr) {
        console.warn('Could not fetch operations:', opsErr)
        setOperations([])
      }
    } catch (err) {
      console.error('Error loading roles:', err)
      setError('Failed to load roles. Please refresh the page.')
    } finally {
      setIsLoadingData(false)
    }
  }


  const handleCreateRole = async (roleName: string, operationsSysId: string[]) => {
    try {
      const newRole = await createRole({
        roleName,
        operationsSysId,
      })
      setRoles([...roles, newRole])
      setSelectedRoleIds(new Set([...selectedRoleIds, newRole.sysId]))
    } catch (err) {
      throw err
    }
  }

  const toggleRole = (roleSysId: string) => {
    const newSelected = new Set(selectedRoleIds)
    if (newSelected.has(roleSysId)) {
      newSelected.delete(roleSysId)
    } else {
      newSelected.add(roleSysId)
    }
    setSelectedRoleIds(newSelected)
  }

  // Extract role name without company prefix (format: CompanyName_RoleName)
  const getDisplayRoleName = (fullRoleName: string) => {
    const parts = fullRoleName.split('_')
    // If there's an underscore, return everything after the first part (company name)
    return parts.length > 1 ? parts.slice(1).join('_') : fullRoleName
  }

  const onSubmit = async (data: InviteEmployeeFormData) => {
    setError('')
    setSuccessMessage('')

    if (selectedRoleIds.size === 0) {
      setError('Please select at least one role for the employee')
      return
    }

    try {
      const result = await inviteEmployee({
        fullName: data.fullName,
        email: data.email,
        status: 'ACTIVE',
        phoneNumber: data.phoneNumber,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressLine3: data.addressLine3,
        roles: Array.from(selectedRoleIds),
        pincode: parseInt(data.pincode, 10),
      })

      if (result.success) {
        setSuccessMessage(result.message)
        reset()
        setSelectedRoleIds(new Set())
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    }
  }

  if (!user) return null

  // Check if user has permission to invite employees
  if (!canInviteEmployee(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to invite employees. Please contact your administrator to request access.
              </p>
              <Link href="/dashboard">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {user.company?.companyLogoUrl ? (
                <img
                  src={user.company.companyLogoUrl}
                  alt={user.company.companyName}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : null}
              <span className="text-sm text-gray-600">{user.company?.companyName}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invite Employee</h1>
          <p className="text-gray-600">
            Add a new team member to your organization and assign roles with specific permissions.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-600" />
                <CardTitle>Employee Information</CardTitle>
              </div>
              <CardDescription>
                Enter the details of the employee you want to invite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john.doe@company.com"
                  required
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Phone Number"
                  placeholder="+919876543210"
                  required
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />
                <Input
                  label="Pincode"
                  placeholder="560001"
                  maxLength={6}
                  required
                  error={errors.pincode?.message}
                  {...register('pincode')}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address Line 1"
                    placeholder="Building name, Street"
                    required
                    error={errors.addressLine1?.message}
                    {...register('addressLine1')}
                  />
                </div>
                <Input
                  label="Address Line 2 (Optional)"
                  placeholder="Locality, Area"
                  error={errors.addressLine2?.message}
                  {...register('addressLine2')}
                />
                <Input
                  label="Address Line 3 (Optional)"
                  placeholder="Landmark"
                  error={errors.addressLine3?.message}
                  {...register('addressLine3')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Role Assignment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <div>
                    <CardTitle>Assign Roles</CardTitle>
                    <CardDescription>
                      Select existing roles or create a new one
                    </CardDescription>
                  </div>
                </div>
                {canCreateRole(user) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreateRoleModalOpen(true)}
                    disabled={isLoadingData}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Role
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingData ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading roles...</p>
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No roles available</p>
                  <p className="text-sm text-gray-500">Please contact your administrator to create roles first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">
                    Selected {selectedRoleIds.size} role(s)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.map((role) => {
                      const isSelected = selectedRoleIds.has(role.sysId)
                      return (
                        <button
                          key={role.roleId}
                          type="button"
                          onClick={() => toggleRole(role.sysId)}
                          onDoubleClick={() => setViewingRole(role)}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-primary-600'
                                : 'bg-white border-2 border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                              {getDisplayRoleName(role.roleName)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {role.operations.length} permission(s)
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={selectedRoleIds.size === 0}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </form>
      </main>

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onCreateRole={handleCreateRole}
        operations={operations}
      />

      {/* Role Details Modal */}
      {viewingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setViewingRole(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{getDisplayRoleName(viewingRole.roleName)}</h2>
                <p className="text-sm text-gray-500 mt-1">{viewingRole.operations.length} permissions assigned</p>
              </div>
              <button
                onClick={() => setViewingRole(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Permissions</h3>
              <div className="space-y-2">
                {viewingRole.operations.map((operation) => (
                  <div
                    key={operation.sys_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {operation.operationName.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {operation.operationType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setViewingRole(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InviteEmployeePage() {
  return (
    <ProtectedRoute>
      <InviteEmployeeContent />
    </ProtectedRoute>
  )
}
