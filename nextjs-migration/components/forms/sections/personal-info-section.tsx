"use client"

import React, { useState } from 'react'
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '../language-provider'
import { useToast } from '@/hooks/use-toast'
import { FormData } from '@/lib/form-schema'
import { compressImage, validateImageFile, villages } from '@/lib/form-utils'

interface PersonalInfoProps {
  register: UseFormRegister<FormData>
  control: Control<FormData>
  errors: FieldErrors<FormData>
  setValue: UseFormSetValue<FormData>
}

export function PersonalInfoSection({ register, control, errors, setValue }: PersonalInfoProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive"
      })
      return
    }
    
    try {
      // Compress image for better performance
      const compressedImage = await compressImage(file, 600, 0.7)
      setPhotoPreview(compressedImage)
      setValue('photo', compressedImage, { shouldValidate: true })
      
      toast({
        title: "Photo uploaded successfully",
        description: "Image has been compressed and optimized for submission",
      })
    } catch (error) {
      console.error('Image compression failed:', error)
      toast({
        title: "Upload failed",
        description: "Failed to process the image file",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="First name"
            autoComplete="off"
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="middleName">Middle Name (optional)</Label>
          <Input
            id="middleName"
            {...register('middleName')}
            placeholder="Middle name (optional)"
            autoComplete="off"
          />
          {errors.middleName && (
            <p className="text-sm text-red-600 mt-1">{errors.middleName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Last name"
            autoComplete="off"
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div></div>
      </div>

      <div>
        <Label htmlFor="photo">Upload Photo *</Label>
        <div className="mt-2">
          <input
            type="file"
            id="photo"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handlePhotoUpload}
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Required: JPEG, PNG, or WebP format, max 5MB
          </p>
          {photoPreview && (
            <div className="mt-2">
              <img 
                src={photoPreview} 
                alt="Student photo preview" 
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200" 
              />
            </div>
          )}
          {errors.photo && (
            <p className="text-sm text-red-600 mt-1">{errors.photo.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth', {
              onChange: (e) => {
                const birthDate = e.target.value
                if (birthDate) {
                  const today = new Date()
                  const birth = new Date(birthDate)
                  const calculatedAge = today.getFullYear() - birth.getFullYear() - 
                    (today.getMonth() < birth.getMonth() || 
                     (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0)
                  setValue('age', calculatedAge, { shouldValidate: true })
                }
              }
            })}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="aadharNumber">Aadhar Number (optional)</Label>
          <Input
            id="aadharNumber"
            {...register('aadharNumber')}
            placeholder="12-digit Aadhar number"
            inputMode="numeric"
            maxLength={12}
            autoComplete="off"
          />
          {errors.aadharNumber && (
            <p className="text-sm text-red-600 mt-1">{errors.aadharNumber.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age (Auto-calculated) *</Label>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            readOnly
            className="bg-gray-50"
            placeholder="Will be calculated from date of birth"
          />
          {errors.age && (
            <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="villageName">Village *</Label>
          <Controller
            name="villageName"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select village" />
                </SelectTrigger>
                <SelectContent>
                  {villages.map((village) => (
                    <SelectItem key={village} value={village}>
                      {village}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.villageName && (
            <p className="text-sm text-red-600 mt-1">{errors.villageName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="disability">Disability *</Label>
        <Controller
          name="disability"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="No disability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No disability</SelectItem>
                <SelectItem value="physical">Physical disability</SelectItem>
                <SelectItem value="visual">Visual disability</SelectItem>
                <SelectItem value="hearing">Hearing disability</SelectItem>
                <SelectItem value="intellectual">Intellectual disability</SelectItem>
                <SelectItem value="other">Other disability</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  )
}