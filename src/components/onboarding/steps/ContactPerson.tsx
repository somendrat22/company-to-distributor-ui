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
        <CardTitle>Contact Person Details</CardTitle>
        <CardDescription>
          Primary contact person for your company account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Contact Person Name"
            placeholder="Full name of the contact person"
            required
            error={errors.contactPersonName?.message}
            {...register('contactPersonName')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              placeholder="9876543210"
              required
              type="tel"
              maxLength={10}
              helperText="10-digit mobile number"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
            <Input
              label="Email Address"
              placeholder="contact@company.com"
              required
              type="email"
              error={errors.emailAddress?.message}
              {...register('emailAddress')}
            />
          </div>

          <Input
            label="Support Email"
            placeholder="support@company.com (optional)"
            type="email"
            helperText="Alternative email for support queries"
            error={errors.supportEmail?.message}
            {...register('supportEmail')}
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
