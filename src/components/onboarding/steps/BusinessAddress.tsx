'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { businessAddressSchema, BusinessAddressFormData } from '@/lib/validations'

interface BusinessAddressProps {
  initialData?: Partial<BusinessAddressFormData>
  onNext: (data: BusinessAddressFormData) => void
  onBack: () => void
}

export function BusinessAddress({ initialData, onNext, onBack }: BusinessAddressProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessAddressFormData>({
    resolver: zodResolver(businessAddressSchema),
    defaultValues: initialData || {
      country: 'India',
    },
  })

  const onSubmit = async (data: BusinessAddressFormData) => {
    onNext(data)
  }

  return (
    <Card className="max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Business Address</CardTitle>
        <CardDescription>
          Provide your company's registered business address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Address Line 1"
            placeholder="Building name, street address"
            required
            error={errors.addressLine1?.message}
            {...register('addressLine1')}
          />

          <Input
            label="Address Line 2"
            placeholder="Landmark, area (optional)"
            error={errors.addressLine2?.message}
            {...register('addressLine2')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="City"
              placeholder="e.g., Mumbai"
              required
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State"
              placeholder="e.g., Maharashtra"
              required
              error={errors.state?.message}
              {...register('state')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Pincode"
              placeholder="400001"
              required
              maxLength={6}
              error={errors.pincode?.message}
              {...register('pincode')}
            />
            <Input
              label="Country"
              value="India"
              disabled
              required
              {...register('country')}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
