'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { companyRegistrationSchema, CompanyRegistrationFormData } from '@/lib/validations'

interface CompanyRegistrationProps {
  initialData?: Partial<CompanyRegistrationFormData>
  onNext: (data: CompanyRegistrationFormData) => void
  onBack?: () => void
}

export function CompanyRegistration({ initialData, onNext, onBack }: CompanyRegistrationProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyRegistrationFormData>({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: initialData || {
      companyType: '' as any,
      country: 'India',
    },
  })

  const onSubmit = async (data: CompanyRegistrationFormData) => {
    onNext(data)
  }

  return (
    <Card className="max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Company Registration</CardTitle>
        <CardDescription>
          Enter your company's basic information to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              placeholder="e.g., Parle Products Pvt Ltd"
              required
              error={errors.companyName?.message}
              {...register('companyName')}
            />
            <Input
              label="Legal Name"
              placeholder="Legal registered name"
              required
              error={errors.legalName?.message}
              {...register('legalName')}
            />
          </div>

          <Select
            label="Company Type"
            placeholder="Select company type"
            required
            options={[
              { value: 'Manufacturer', label: 'Manufacturer' },
              { value: 'Supplier', label: 'Supplier' },
              { value: 'Brand Owner', label: 'Brand Owner' },
            ]}
            error={errors.companyType?.message}
            {...register('companyType')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="GST Number"
              placeholder="22AAAAA0000A1Z5"
              required
              maxLength={15}
              helperText="15-character GST identification number"
              error={errors.gstNumber?.message}
              {...register('gstNumber')}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase()
              }}
            />
            <Input
              label="PAN Number"
              placeholder="AAAAA0000A"
              required
              maxLength={10}
              helperText="10-character PAN number"
              error={errors.panNumber?.message}
              {...register('panNumber')}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase()
              }}
            />
          </div>

          <Input
            label="CIN Number"
            placeholder="U12345AB2020PTC123456"
            helperText="Corporate Identification Number (optional)"
            error={errors.cinNumber?.message}
            {...register('cinNumber')}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
            }}
          />

          <div className="flex justify-between pt-6">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className={!onBack ? 'ml-auto' : ''}
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
