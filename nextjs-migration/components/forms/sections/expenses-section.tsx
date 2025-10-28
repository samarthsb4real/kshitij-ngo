"use client"

import React from 'react'
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormData } from '@/lib/form-schema'

interface ExpensesProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  watch: UseFormWatch<FormData>
}

export function ExpensesSection({ register, errors, watch }: ExpensesProps) {
  const watchedExpenses = watch([
    'tuitionFees', 'booksCost', 'stationeryCost', 'travelCost',
    'uniformCost', 'examFees', 'hostelFees', 'otherExpenses'
  ])

  const totalExpenses = watchedExpenses.reduce((sum, expense) => {
    const num = Number(expense) || 0
    return Number.isFinite(num) && num >= 0 ? sum + num : sum
  }, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tuitionFees">Tuition Fees *</Label>
          <Input
            id="tuitionFees"
            type="number"
            min="0"
            step="1"
            {...register('tuitionFees', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
          {errors.tuitionFees && (
            <p className="text-sm text-red-600 mt-1">{errors.tuitionFees.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="booksCost">Books Cost *</Label>
          <Input
            id="booksCost"
            type="number"
            min="0"
            step="1"
            {...register('booksCost', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
          {errors.booksCost && (
            <p className="text-sm text-red-600 mt-1">{errors.booksCost.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stationeryCost">Stationery Cost *</Label>
          <Input
            id="stationeryCost"
            type="number"
            min="0"
            step="1"
            {...register('stationeryCost', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
          {errors.stationeryCost && (
            <p className="text-sm text-red-600 mt-1">{errors.stationeryCost.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="travelCost">Travel Cost *</Label>
          <Input
            id="travelCost"
            type="number"
            min="0"
            step="1"
            {...register('travelCost', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
          {errors.travelCost && (
            <p className="text-sm text-red-600 mt-1">{errors.travelCost.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="uniformCost">Uniform Cost (optional)</Label>
          <Input
            id="uniformCost"
            type="number"
            min="0"
            step="1"
            {...register('uniformCost', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
        </div>
        
        <div>
          <Label htmlFor="examFees">Exam Fees (optional)</Label>
          <Input
            id="examFees"
            type="number"
            min="0"
            step="1"
            {...register('examFees', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hostelFees">Hostel Fees (optional)</Label>
          <Input
            id="hostelFees"
            type="number"
            min="0"
            step="1"
            {...register('hostelFees', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
        </div>
        
        <div>
          <Label htmlFor="otherExpenses">Other Expenses (optional)</Label>
          <Input
            id="otherExpenses"
            type="number"
            min="0"
            step="1"
            {...register('otherExpenses', { valueAsNumber: true })}
            placeholder="0"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <Label className="text-lg font-semibold">Total Expenses</Label>
        <div className="text-2xl font-bold text-primary mt-2">
          ₹{totalExpenses.toLocaleString()}
        </div>
      </div>
    </div>
  )
}