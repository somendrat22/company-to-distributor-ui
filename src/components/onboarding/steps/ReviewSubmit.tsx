'use client'

import React, { useState } from 'react'
import { Edit2, Building2, MapPin, User, CreditCard, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { OnboardingFormData } from '@/types'

interface ReviewSubmitProps {
  data: OnboardingFormData
  onBack: () => void
  onEdit: (step: number) => void
  onSubmit: () => Promise<void>
}

export function ReviewSubmit({ data, onBack, onEdit, onSubmit }: ReviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review & Submit</CardTitle>
          <CardDescription>
            Please review all information before submitting
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Company Registration */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Building2 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Company Registration</h3>
                <p className="text-sm text-gray-500">Basic company information</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(0)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Company Name</p>
              <p className="font-medium text-gray-900">{data.companyRegistration.companyName}</p>
            </div>
            <div>
              <p className="text-gray-500">Legal Name</p>
              <p className="font-medium text-gray-900">{data.companyRegistration.legalName}</p>
            </div>
            <div>
              <p className="text-gray-500">Company Type</p>
              <p className="font-medium text-gray-900">{data.companyRegistration.companyType}</p>
            </div>
            <div>
              <p className="text-gray-500">GST Number</p>
              <p className="font-medium text-gray-900">{data.companyRegistration.gstNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">PAN Number</p>
              <p className="font-medium text-gray-900">{data.companyRegistration.panNumber}</p>
            </div>
            {data.companyRegistration.cinNumber && (
              <div>
                <p className="text-gray-500">CIN Number</p>
                <p className="font-medium text-gray-900">{data.companyRegistration.cinNumber}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Address */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <MapPin className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Address</h3>
                <p className="text-sm text-gray-500">Registered office address</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {data.businessAddress.addressLine1}
              {data.businessAddress.addressLine2 && `, ${data.businessAddress.addressLine2}`}
            </p>
            <p className="text-gray-600">
              {data.businessAddress.city}, {data.businessAddress.state} - {data.businessAddress.pincode}
            </p>
            <p className="text-gray-600">{data.businessAddress.country}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contact Person</h3>
                <p className="text-sm text-gray-500">Primary contact details</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{data.contactPerson.contactPersonName}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{data.contactPerson.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{data.contactPerson.emailAddress}</p>
            </div>
            {data.contactPerson.supportEmail && (
              <div>
                <p className="text-gray-500">Support Email</p>
                <p className="font-medium text-gray-900">{data.contactPerson.supportEmail}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banking Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Banking Details</h3>
                <p className="text-sm text-gray-500">Account information</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Bank Name</p>
              <p className="font-medium text-gray-900">{data.bankingDetails.bankName}</p>
            </div>
            <div>
              <p className="text-gray-500">Account Number</p>
              <p className="font-medium text-gray-900">
                ****{data.bankingDetails.accountNumber.slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">IFSC Code</p>
              <p className="font-medium text-gray-900">{data.bankingDetails.ifscCode}</p>
            </div>
            {data.bankingDetails.branchName && (
              <div>
                <p className="text-gray-500">Branch</p>
                <p className="font-medium text-gray-900">{data.bankingDetails.branchName}</p>
              </div>
            )}
            {data.bankingDetails.upiId && (
              <div>
                <p className="text-gray-500">UPI ID</p>
                <p className="font-medium text-gray-900">{data.bankingDetails.upiId}</p>
              </div>
            )}
            {data.bankingDetails.defaultCreditLimit && (
              <div>
                <p className="text-gray-500">Default Credit Limit</p>
                <p className="font-medium text-gray-900">
                  ₹{data.bankingDetails.defaultCreditLimit.toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Documents</h3>
                <p className="text-sm text-gray-500">Uploaded KYC documents</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(4)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            {data.documents.gstCertificate && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-900">GST Certificate uploaded</span>
              </div>
            )}
            {data.documents.panCard && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-900">PAN Card uploaded</span>
              </div>
            )}
            {data.documents.registrationDocument && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-900">Registration Document uploaded</span>
              </div>
            )}
            {data.documents.companyLogo && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-900">Company Logo uploaded</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
              <p className="text-sm text-gray-600 mt-1">
                By submitting, you confirm that all information provided is accurate and complete.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                size="lg"
                className="min-w-[200px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
