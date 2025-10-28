"use client"

import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormData } from '@/lib/form-schema'

interface AcademicPerformanceProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
}

export function AcademicPerformanceSection({ register, errors }: AcademicPerformanceProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Most Recent Year *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year1Class">Class/Year</Label>
            <Input
              id="year1Class"
              {...register('year1Class')}
              placeholder="e.g., 12th, 2nd Year B.A."
            />
          </div>
          <div>
            <Label htmlFor="year1Marks">Marks (Percentage %)</Label>
            <Input
              id="year1Marks"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register('year1Marks', { valueAsNumber: true })}
              placeholder="e.g., 85.5"
            />
            {errors.year1Marks && (
              <p className="text-sm text-red-600 mt-1">{errors.year1Marks.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Second Recent Year *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year2Class">Class/Year</Label>
            <Input
              id="year2Class"
              {...register('year2Class')}
              placeholder="e.g., 11th, 1st Year B.A."
            />
          </div>
          <div>
            <Label htmlFor="year2Marks">Marks (Percentage %)</Label>
            <Input
              id="year2Marks"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register('year2Marks', { valueAsNumber: true })}
              placeholder="e.g., 78.0"
            />
            {errors.year2Marks && (
              <p className="text-sm text-red-600 mt-1">{errors.year2Marks.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Third Recent Year *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year3Class">Class/Year</Label>
            <Input
              id="year3Class"
              {...register('year3Class')}
              placeholder="e.g., 10th, 12th"
            />
          </div>
          <div>
            <Label htmlFor="year3Marks">Marks (Percentage %)</Label>
            <Input
              id="year3Marks"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register('year3Marks', { valueAsNumber: true })}
              placeholder="e.g., 72.5"
            />
            {errors.year3Marks && (
              <p className="text-sm text-red-600 mt-1">{errors.year3Marks.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="achievements">Academic Achievements & Awards (optional)</Label>
        <Textarea
          id="achievements"
          {...register('achievements')}
          placeholder="List any scholarships, awards, competitions won, or other achievements"
          rows={4}
        />
        {errors.achievements && (
          <p className="text-sm text-red-600 mt-1">{errors.achievements.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Examples: District rank in board exams, sports achievements, science fair winners, etc.
        </p>
      </div>
    </div>
  )
}