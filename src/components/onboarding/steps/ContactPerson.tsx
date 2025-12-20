'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { contactPersonSchema, ContactPersonFormData } from '@/lib/validations'

interface ContactPersonProps {
  initialData?: Partial<ContactPersonFormData>
  onNext: (data: ContactPersonFormData) => void
  onBack: () => void
}

export function ContactPerson({ initialData, onNext, onBack }: ContactPersonProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactPersonFormData>({
    resolver: zodResolver(contactPersonSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: ContactPersonFormData) => {
    onNext(data)
  }

  return (
    <Card className="max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Support Contact Details</CardTitle>
        <CardDescription>
          Provide support contact information for your company
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Support Email"
            placeholder="support@company.com"
            required
            type="email"
            helperText="Primary email for support queries"
            error={errors.supportEmail?.message}
            {...register('supportEmail')}
          />

          <Input
            label="Support Phone Number"
            placeholder="9876543210"
            required
            type="tel"
            maxLength={10}
            helperText="10-digit mobile number for support"
            error={errors.supportPhoneNumber?.message}
            {...register('supportPhoneNumber')}
          />

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
