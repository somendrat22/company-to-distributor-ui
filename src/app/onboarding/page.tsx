'use client'

import React, { useState, useEffect } from 'react'
import { Stepper } from '@/components/onboarding/Stepper'
import { CompanyRegistration } from '@/components/onboarding/steps/CompanyRegistration'
import { BusinessAddress } from '@/components/onboarding/steps/BusinessAddress'
import { ContactPerson } from '@/components/onboarding/steps/ContactPerson'
import { BankingDetails } from '@/components/onboarding/steps/BankingDetails'
import { DocumentUpload } from '@/components/onboarding/steps/DocumentUpload'
import { ReviewSubmit } from '@/components/onboarding/steps/ReviewSubmit'
import { Success } from '@/components/onboarding/steps/Success'
import { OnboardingFormData } from '@/types'
import { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } from '@/lib/utils'
import { submitOnboarding } from '@/lib/api'

const STORAGE_KEY = 'onboarding_form_data'

const steps = [
  { id: 1, title: 'Company Info', description: 'Basic details' },
  { id: 2, title: 'Address', description: 'Business location' },
  { id: 3, title: 'Contact', description: 'Contact person' },
  { id: 4, title: 'Banking', description: 'Account details' },
  { id: 5, title: 'Documents', description: 'KYC upload' },
  { id: 6, title: 'Review', description: 'Final check' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [applicationId, setApplicationId] = useState<string>()
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>(() => {
    if (typeof window !== 'undefined') {
      return getFromLocalStorage<Partial<OnboardingFormData>>(STORAGE_KEY) || {}
    }
    return {}
  })

  // Auto-save form data to localStorage
  useEffect(() => {
    if (currentStep < 6 && Object.keys(formData).length > 0) {
      saveToLocalStorage(STORAGE_KEY, formData)
    }
  }, [formData, currentStep])

  const handleNext = (stepData: any, stepKey: keyof OnboardingFormData) => {
    const updatedData = { ...formData, [stepKey]: stepData }
    setFormData(updatedData)
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleEdit = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleSubmit = async () => {
    try {
      const result = await submitOnboarding(formData as OnboardingFormData)
      if (result.success) {
        setApplicationId(result.applicationId)
        clearLocalStorage(STORAGE_KEY)
        setCurrentStep(6)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit application. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {currentStep < 6 && (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Company Onboarding
            </h1>
            <p className="text-gray-600">
              Complete all steps to register your company
            </p>
          </div>
        )}

        {/* Stepper */}
        {currentStep < 6 && (
          <Stepper steps={steps} currentStep={currentStep} />
        )}

        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 0 && (
            <CompanyRegistration
              initialData={formData.companyRegistration}
              onNext={(data) => handleNext(data, 'companyRegistration')}
            />
          )}

          {currentStep === 1 && (
            <BusinessAddress
              initialData={formData.businessAddress}
              onNext={(data) => handleNext(data, 'businessAddress')}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <ContactPerson
              initialData={formData.contactPerson}
              onNext={(data) => handleNext(data, 'contactPerson')}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <BankingDetails
              initialData={formData.bankingDetails}
              onNext={(data) => handleNext(data, 'bankingDetails')}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <DocumentUpload
              initialData={formData.documents}
              onNext={(data) => handleNext(data, 'documents')}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <ReviewSubmit
              data={formData as OnboardingFormData}
              onBack={handleBack}
              onEdit={handleEdit}
              onSubmit={handleSubmit}
            />
          )}

          {currentStep === 6 && (
            <Success applicationId={applicationId} />
          )}
        </div>
      </div>
    </div>
  )
}
