'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { FileUpload } from '@/components/ui/FileUpload'
import { DocumentUploadData, UploadedDocument } from '@/types'

interface DocumentUploadProps {
  initialData?: DocumentUploadData
  onNext: (data: DocumentUploadData) => void
  onBack: () => void
}

export function DocumentUpload({ initialData, onNext, onBack }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentUploadData>(initialData || {})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!documents.gstCertificate) {
      newErrors.gstCertificate = 'GST Certificate is required'
    }
    if (!documents.panCard) {
      newErrors.panCard = 'PAN Card is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onNext(documents)
  }

  const updateDocument = (key: keyof DocumentUploadData, file: UploadedDocument | undefined) => {
    setDocuments((prev) => ({ ...prev, [key]: file }))
    if (file && errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  return (
    <Card className="max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Document Upload (KYC)</CardTitle>
        <CardDescription>
          Upload required documents for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FileUpload
            label="GST Certificate"
            required
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5}
            helperText="Upload your GST registration certificate"
            value={documents.gstCertificate}
            onChange={(file) => updateDocument('gstCertificate', file)}
            error={errors.gstCertificate}
          />

          <FileUpload
            label="PAN Card"
            required
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5}
            helperText="Upload company PAN card"
            value={documents.panCard}
            onChange={(file) => updateDocument('panCard', file)}
            error={errors.panCard}
          />

          <FileUpload
            label="Company Registration Document"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={5}
            helperText="Certificate of Incorporation or similar (optional)"
            value={documents.registrationDocument}
            onChange={(file) => updateDocument('registrationDocument', file)}
          />

          <FileUpload
            label="Company Logo"
            accept=".jpg,.jpeg,.png,.svg"
            maxSize={2}
            helperText="Your company logo for branding (optional)"
            value={documents.companyLogo}
            onChange={(file) => updateDocument('companyLogo', file)}
          />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> All documents must be clear and legible. Supported formats: PDF, JPG, PNG. Maximum file size: 5MB.
            </p>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Continue to Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
