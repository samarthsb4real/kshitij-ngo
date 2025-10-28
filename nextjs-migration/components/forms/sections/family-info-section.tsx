"use client"

import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '../language-provider'
import { FormData } from '@/lib/form-schema'

interface FamilyInfoProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
}

export function FamilyInfoSection({ register, errors }: FamilyInfoProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fatherName">Father's Name *</Label>
          <Input
            id="fatherName"
            {...register('fatherName')}
            placeholder="Enter father's full name"
            autoComplete="off"
          />
          {errors.fatherName && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="motherName">Mother's Name *</Label>
          <Input
            id="motherName"
            {...register('motherName')}
            placeholder="Enter mother's full name"
            autoComplete="off"
          />
          {errors.motherName && (
            <p className="text-sm text-red-600 mt-1">{errors.motherName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fatherAge">Father's Age *</Label>
          <Input
            id="fatherAge"
            type="number"
            min="25"
            max="100"
            step="1"
            {...register('fatherAge', { valueAsNumber: true })}
            placeholder="Age"
            autoComplete="off"
          />
          {errors.fatherAge && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherAge.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="fatherOccupation">Father's Occupation *</Label>
          <Input
            id="fatherOccupation"
            {...register('fatherOccupation')}
            placeholder="e.g., Farmer, Teacher, Business"
            autoComplete="off"
          />
          {errors.fatherOccupation && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherOccupation.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fatherIncome">Father's Annual Income *</Label>
          <Input
            id="fatherIncome"
            type="number"
            min="0"
            step="1000"
            {...register('fatherIncome', { valueAsNumber: true })}
            placeholder="Annual income"
            autoComplete="off"
          />
          {errors.fatherIncome && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherIncome.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="familyYearlyIncome">Total Family Income *</Label>
          <Input
            id="familyYearlyIncome"
            type="number"
            min="0"
            step="1000"
            {...register('familyYearlyIncome', { valueAsNumber: true })}
            placeholder="Total family income"
            autoComplete="off"
          />
          {errors.familyYearlyIncome && (
            <p className="text-sm text-red-600 mt-1">{errors.familyYearlyIncome.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalFamilyMembers">Total Family Members *</Label>
          <Input
            id="totalFamilyMembers"
            type="number"
            min="1"
            max="50"
            step="1"
            {...register('totalFamilyMembers', { valueAsNumber: true })}
            placeholder="Number of members"
            autoComplete="off"
          />
          {errors.totalFamilyMembers && (
            <p className="text-sm text-red-600 mt-1">{errors.totalFamilyMembers.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="earningMembers">Earning Members *</Label>
          <Input
            id="earningMembers"
            type="number"
            min="0"
            max="20"
            step="1"
            {...register('earningMembers', { valueAsNumber: true })}
            placeholder="Number of earning members"
            autoComplete="off"
          />
          {errors.earningMembers && (
            <p className="text-sm text-red-600 mt-1">{errors.earningMembers.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="educationExpenseBearer">Who Bears Education Expenses? *</Label>
        <Input
          id="educationExpenseBearer"
          {...register('educationExpenseBearer')}
          placeholder="e.g., Father, Mother, Self, Relative"
          autoComplete="off"
        />
        {errors.educationExpenseBearer && (
          <p className="text-sm text-red-600 mt-1">{errors.educationExpenseBearer.message}</p>
        )}
      </div>
    </div>
  )
}