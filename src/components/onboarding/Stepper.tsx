'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300',
                      isCompleted && 'bg-primary-600 text-white',
                      isCurrent && 'bg-primary-600 text-white ring-4 ring-primary-100',
                      isUpcoming && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-1 mx-2 transition-all duration-300',
                        index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      isCurrent ? 'text-primary-600' : 'text-gray-600'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden md:block">
                    {step.description}
                  </p>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
