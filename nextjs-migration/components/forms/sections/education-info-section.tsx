"use client"

import React, { useState, useEffect } from 'react'
import { Control, FieldErrors, UseFormRegister, useWatch } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '../language-provider'
import { FormData } from '@/lib/form-schema'
import { educationStreams } from '@/lib/form-utils'

interface EducationInfoProps {
  register: UseFormRegister<FormData>
  control: Control<FormData>
  errors: FieldErrors<FormData>
  setValue: (name: keyof FormData, value: any, options?: any) => void
}

export function EducationInfoSection({ register, control, errors, setValue }: EducationInfoProps) {
  const { t } = useLanguage()
  const currentEducation = useWatch({ control, name: 'currentEducation' })
  const [showOtherEducation, setShowOtherEducation] = useState(false)

  // Update showOtherEducation when currentEducation changes
  useEffect(() => {
    setShowOtherEducation(currentEducation === 'other')
    // Clear otherEducation field when it's not needed
    if (currentEducation !== 'other') {
      setValue('otherEducation', '', { shouldValidate: true })
    }
  }, [currentEducation, setValue])

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="currentEducation">Current Education *</Label>
        <Controller
          name="currentEducation"
          control={control}
          render={({ field }) => (
            <Select 
              value={field.value} 
              onValueChange={(value) => {
                field.onChange(value)
                setShowOtherEducation(value === 'other')
                // Clear otherEducation field when switching away from 'other'
                if (value !== 'other') {
                  setValue('otherEducation', '', { shouldValidate: true })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationStreams.map((stream) => (
                  <SelectItem key={stream.value} value={stream.value}>
                    {stream.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.currentEducation && (
          <p className="text-sm text-red-600 mt-1">{errors.currentEducation.message}</p>
        )}
      </div>

      {showOtherEducation && (
        <div>
          <Label htmlFor="otherEducation">Please Specify Education *</Label>
          <Input
            id="otherEducation"
            {...register('otherEducation')}
            placeholder="Please specify your education level"
            autoComplete="off"
          />
          {errors.otherEducation && (
            <p className="text-sm text-red-600 mt-1">{errors.otherEducation.message}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="schoolName">School/College Name *</Label>
        <Input
          id="schoolName"
          {...register('schoolName')}
          placeholder="Enter institution name"
          autoComplete="off"
        />
        {errors.schoolName && (
          <p className="text-sm text-red-600 mt-1">{errors.schoolName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="futurePlans">Future Plans *</Label>
        <Textarea
          id="futurePlans"
          {...register('futurePlans')}
          placeholder="Describe your academic goals and career aspirations"
          rows={4}
        />
        {errors.futurePlans && (
          <p className="text-sm text-red-600 mt-1">{errors.futurePlans.message}</p>
        )}
      </div>
    </div>
  )
}