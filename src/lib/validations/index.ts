import { z } from 'zod'
import { validateGST, validatePAN, validateIFSC, validatePincode } from '../utils'

export const companyRegistrationSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  legalName: z.string().min(2, 'Legal name must be at least 2 characters'),
  companyType: z.enum(['Manufacturer', 'Supplier', 'Brand Owner'], {
    required_error: 'Please select a company type',
  }),
  gstNumber: z
    .string()
    .min(15, 'GST number must be 15 characters')
    .max(15, 'GST number must be 15 characters')
    .refine(validateGST, 'Invalid GST number format'),
  panNumber: z
    .string()
    .min(10, 'PAN number must be 10 characters')
    .max(10, 'PAN number must be 10 characters')
    .refine(validatePAN, 'Invalid PAN number format'),
  cinNumber: z.string().optional(),
})

export const businessAddressSchema = z.object({
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  city: z.string().min(2, 'City name must be at least 2 characters'),
  state: z.string().min(2, 'State name must be at least 2 characters'),
  pincode: z
    .string()
    .length(6, 'Pincode must be 6 digits')
    .refine(validatePincode, 'Invalid pincode format'),
  country: z.string().default('India'),
  geoLatitude: z.string().optional(),
  geoLongitude: z.string().optional(),
})

export const contactPersonSchema = z.object({
  supportEmail: z.string().email('Invalid email address'),
  supportPhoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number format'),
})

export const bankingDetailsSchema = z.object({
  bankName: z.string().min(2, 'Bank name must be at least 2 characters'),
  bankAccountNumber: z
    .string()
    .min(9, 'Account number must be at least 9 digits')
    .max(18, 'Account number must not exceed 18 digits')
    .regex(/^\d+$/, 'Account number must contain only digits'),
  ifscCode: z
    .string()
    .length(11, 'IFSC code must be 11 characters')
    .refine(validateIFSC, 'Invalid IFSC code format'),
  creditLimitForDistributors: z.string().optional(),
})

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>
export type BusinessAddressFormData = z.infer<typeof businessAddressSchema>
export type ContactPersonFormData = z.infer<typeof contactPersonSchema>
export type BankingDetailsFormData = z.infer<typeof bankingDetailsSchema>
