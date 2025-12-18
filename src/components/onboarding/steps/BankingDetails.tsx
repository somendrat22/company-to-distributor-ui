'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { bankingDetailsSchema, BankingDetailsFormData } from '@/lib/validations'

interface BankingDetailsProps {
  initialData?: Partial<BankingDetailsFormData>
  onNext: (data: BankingDetailsFormData) => void
  onBack: () => void
}

export function BankingDetails({ initialData, onNext, onBack }: BankingDetailsProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BankingDetailsFormData>({
    resolver: zodResolver(bankingDetailsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: BankingDetailsFormData) => {
    onNext(data)
  }

  return (
    <Card className="max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle>Banking & Finance Details</CardTitle>
        <CardDescription>
          Add your bank account information for transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Bank Name"
            placeholder="e.g., State Bank of India"
            required
            error={errors.bankName?.message}
            {...register('bankName')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Account Number"
              placeholder="1234567890"
              required
              type="text"
              helperText="9-18 digit account number"
              error={errors.accountNumber?.message}
              {...register('accountNumber')}
            />
            <Input
              label="IFSC Code"
              placeholder="SBIN0001234"
              required
              maxLength={11}
              helperText="11-character IFSC code"
              error={errors.ifscCode?.message}
              {...register('ifscCode')}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase()
              }}
            />
          </div>

          <Input
            label="Branch Name"
            placeholder="e.g., Mumbai Main Branch (optional)"
            error={errors.branchName?.message}
            {...register('branchName')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="UPI ID"
              placeholder="company@upi (optional)"
              helperText="For quick payments"
              error={errors.upiId?.message}
              {...register('upiId')}
            />
            <Controller
              name="defaultCreditLimit"
              control={control}
              render={({ field }) => (
                <Input
                  label="Default Distributor Credit Limit"
                  placeholder="50000"
                  type="number"
                  helperText="In INR (optional)"
                  error={errors.defaultCreditLimit?.message}
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? undefined : Number(value))
                  }}
                />
              )}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The default credit limit will be applied to new distributors.
              You can customize it for individual distributors later.
            </p>
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
