'use client'

import React, { useCallback, useState } from 'react'
import { Upload, File, X, CheckCircle2, Loader2 } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { uploadFile } from '@/lib/api'
import { UploadedDocument } from '@/types'

interface FileUploadProps {
  label: string
  required?: boolean
  accept?: string
  maxSize?: number // in MB
  helperText?: string
  error?: string
  value?: UploadedDocument
  onChange: (file: UploadedDocument | undefined) => void
}

export function FileUpload({
  label,
  required,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5,
  helperText,
  error,
  value,
  onChange,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError('')

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setUploadError(`File size must be less than ${maxSize}MB`)
        return
      }

      // Validate file type
      const acceptedTypes = accept.split(',').map((t) => t.trim())
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        setUploadError(`File type must be one of: ${accept}`)
        return
      }

      setIsUploading(true)
      try {
        const uploadedDoc = await uploadFile(file)
        onChange(uploadedDoc)
      } catch (err) {
        setUploadError('Failed to upload file. Please try again.')
      } finally {
        setIsUploading(false)
      }
    },
    [accept, maxSize, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    onChange(undefined)
    setUploadError('')
  }, [onChange])

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : error || uploadError
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400',
            isUploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            disabled={isUploading}
            className="hidden"
            id={`file-upload-${label}`}
          />
          <label
            htmlFor={`file-upload-${label}`}
            className={cn(
              'cursor-pointer',
              isUploading && 'cursor-not-allowed'
            )}
          >
            <div className="flex flex-col items-center gap-2">
              {isUploading ? (
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
              <div className="text-sm">
                <span className="font-medium text-primary-600">
                  {isUploading ? 'Uploading...' : 'Click to upload'}
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500">
                {accept.toUpperCase()} up to {maxSize}MB
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {value.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(value.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {(error || uploadError) && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error || uploadError}
        </p>
      )}
      {helperText && !error && !uploadError && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
