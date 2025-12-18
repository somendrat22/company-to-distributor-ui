'use client'

import React from 'react'
import { CheckCircle2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface SuccessProps {
  applicationId?: string
}

export function Success({ applicationId }: SuccessProps) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card className="text-center">
        <CardContent className="pt-12 pb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Onboarding Complete!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your company onboarding has been successfully submitted.
          </p>

          {applicationId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-blue-800 mb-1">Application ID</p>
              <p className="text-xl font-mono font-semibold text-blue-900">
                {applicationId}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-amber-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Our team will verify your documents and information within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>You'll receive an email notification once your account is approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>After approval, you can log in and start managing your distributor network</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              disabled
              className="w-full sm:w-auto opacity-60 cursor-not-allowed"
            >
              Go to Dashboard
            </Button>
            <p className="text-xs text-gray-500">
              Dashboard access will be enabled after approval
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
