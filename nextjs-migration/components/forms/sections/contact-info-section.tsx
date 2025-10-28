"use client"

import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '../language-provider'
import { FormData } from '@/lib/form-schema'

interface ContactInfoProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
}

export function ContactInfoSection({ register, errors }: ContactInfoProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          inputMode="numeric"
          pattern="[6-9][0-9]{9}"
          {...register('phoneNumber')}
          placeholder="10-digit mobile number"
          maxLength={10}
          autoComplete="off"
          onInput={(e) => {
            const target = e.target as HTMLInputElement
            target.value = target.value.replace(/[^0-9]/g, '')
          }}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="alternatePhone">Alternate Phone (optional)</Label>
          <Input
            id="alternatePhone"
            type="tel"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            {...register('alternatePhone')}
            placeholder="10-digit mobile number"
            maxLength={10}
            autoComplete="off"
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              target.value = target.value.replace(/[^0-9]/g, '')
            }}
          />
          {errors.alternatePhone && (
            <p className="text-sm text-red-600 mt-1">{errors.alternatePhone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="student@example.com"
            autoComplete="off"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Complete postal address"
          rows={3}
          autoComplete="off"
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="pincode">Pincode *</Label>
        <Input
          id="pincode"
          type="text"
          inputMode="numeric"
          pattern="[1-9][0-9]{5}"
          {...register('pincode')}
          placeholder="6-digit pincode"
          maxLength={6}
          onInput={(e) => {
            const target = e.target as HTMLInputElement
            target.value = target.value.replace(/[^0-9]/g, '')
          }}
        />
        {errors.pincode && (
          <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>
        )}
      </div>
    </div>
  )
}