'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Operation, OperationGroup } from '@/types'

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRole: (roleName: string, selectedOperationIds: string[]) => Promise<void>
  operations: Operation[]
}

export function CreateRoleModal({ isOpen, onClose, onCreateRole, operations }: CreateRoleModalProps) {
  const [roleName, setRoleName] = useState('')
  const [selectedOperations, setSelectedOperations] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Group operations by type
  const operationGroups: OperationGroup[] = operations.reduce((acc, operation) => {
    const existingGroup = acc.find(g => g.type === operation.operationType)
    if (existingGroup) {
      existingGroup.operations.push(operation)
    } else {
      acc.push({
        type: operation.operationType,
        operations: [operation]
      })
    }
    return acc
  }, [] as OperationGroup[])

  const toggleOperation = (operationId: string) => {
    const newSelected = new Set(selectedOperations)
    if (newSelected.has(operationId)) {
      newSelected.delete(operationId)
    } else {
      newSelected.add(operationId)
    }
    setSelectedOperations(newSelected)
  }

  const selectAllInGroup = (groupOperations: Operation[]) => {
    const newSelected = new Set(selectedOperations)
    const allSelected = groupOperations.every(op => newSelected.has(op.sys_id))
    
    if (allSelected) {
      groupOperations.forEach(op => newSelected.delete(op.sys_id))
    } else {
      groupOperations.forEach(op => newSelected.add(op.sys_id))
    }
    setSelectedOperations(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!roleName.trim()) {
      setError('Role name is required')
      return
    }

    if (selectedOperations.size === 0) {
      setError('Please select at least one operation')
      return
    }

    setIsSubmitting(true)
    try {
      await onCreateRole(roleName, Array.from(selectedOperations))
      setRoleName('')
      setSelectedOperations(new Set())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 overflow-y-auto flex-1">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Role Name */}
            <div className="mb-6">
              <Input
                label="Role Name"
                placeholder="e.g., Sales Manager, Warehouse Supervisor"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
              />
            </div>

            {/* Operations Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Permissions
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Choose the operations this role can perform. Selected {selectedOperations.size} operation(s).
              </p>

              <div className="space-y-4">
                {operationGroups.map((group) => {
                  const allSelected = group.operations.every(op => selectedOperations.has(op.sys_id))
                  const someSelected = group.operations.some(op => selectedOperations.has(op.sys_id))

                  return (
                    <div key={group.type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {group.type.replace(/_/g, ' ')}
                          <span className="text-xs font-normal text-gray-500">
                            ({group.operations.length} operations)
                          </span>
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => selectAllInGroup(group.operations)}
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {group.operations.map((operation) => {
                          const isSelected = selectedOperations.has(operation.sys_id)
                          return (
                            <button
                              key={operation.sys_id}
                              type="button"
                              onClick={() => toggleOperation(operation.sys_id)}
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? 'bg-primary-600'
                                    : 'bg-white border-2 border-gray-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm ${isSelected ? 'font-medium text-primary-900' : 'text-gray-700'}`}>
                                {operation.operationName.replace(/_/g, ' ')}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!roleName.trim() || selectedOperations.size === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
