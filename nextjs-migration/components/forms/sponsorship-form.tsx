"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from './language-provider'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  // Personal Information
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.number().min(1).max(21, 'Age must be between 1 and 21'),
  villageName: z.string().min(1, 'Village name is required'),
  disability: z.string().optional(),
  
  // Education Information
  currentEducation: z.string().min(1, 'Current education is required'),
  currentYear: z.string().min(1, 'Current year/class is required'),
  schoolName: z.string().min(1, 'School/college name is required'),
  otherEducation: z.string().optional(),
  futurePlans: z.string().min(10, 'Future plans must be at least 10 characters'),
  
  // Academic Performance
  year1Class: z.string().optional(),
  year1Marks: z.string().optional(),
  year2Class: z.string().optional(),
  year2Marks: z.string().optional(),
  year3Class: z.string().optional(),
  year3Marks: z.string().optional(),
  achievements: z.string().optional(),
  
  // Expenses
  tuitionFees: z.number().min(0, 'Tuition fees cannot be negative'),
  booksCost: z.number().min(0, 'Books cost cannot be negative'),
  stationeryCost: z.number().min(0, 'Stationery cost cannot be negative'),
  travelCost: z.number().min(0, 'Travel cost cannot be negative'),
  uniformCost: z.number().min(0).optional(),
  examFees: z.number().min(0).optional(),
  hostelFees: z.number().min(0).optional(),
  otherExpenses: z.number().min(0).optional(),
  
  // Family Information
  fatherName: z.string().min(2, 'Father name is required'),
  fatherAge: z.number().min(18).max(100, 'Father age must be between 18 and 100'),
  fatherOccupation: z.string().min(1, 'Father occupation is required'),
  fatherIncome: z.number().min(0, 'Father income cannot be negative'),
  familyYearlyIncome: z.number().min(0, 'Family income cannot be negative'),
  totalFamilyMembers: z.number().min(1, 'Total family members must be at least 1'),
  earningMembers: z.number().min(0, 'Earning members cannot be negative'),
  educationExpenseBearer: z.string().min(1, 'Education expense bearer is required'),
  
  // Contact Information
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters')
})

type FormData = z.infer<typeof formSchema>

interface SponsorshipFormProps {
  language: string
  onProgressChange: (progress: number) => void
  onSubmit: () => void
}

export function SponsorshipForm({ language, onProgressChange, onSubmit }: SponsorshipFormProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [currentSection, setCurrentSection] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  })

  const watchedFields = watch()

  // Calculate age from date of birth
  useEffect(() => {
    const dob = watchedFields.dateOfBirth
    if (dob) {
      const birthDate = new Date(dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age > 0 && age <= 21) {
        setValue('age', age)
      }
    }
  }, [watchedFields.dateOfBirth, setValue])

  // Calculate total expenses
  useEffect(() => {
    const expenses = [
      watchedFields.tuitionFees || 0,
      watchedFields.booksCost || 0,
      watchedFields.stationeryCost || 0,
      watchedFields.travelCost || 0,
      watchedFields.uniformCost || 0,
      watchedFields.examFees || 0,
      watchedFields.hostelFees || 0,
      watchedFields.otherExpenses || 0
    ]
    const total = expenses.reduce((sum, expense) => sum + Number(expense), 0)
    setTotalExpenses(total)
  }, [
    watchedFields.tuitionFees,
    watchedFields.booksCost,
    watchedFields.stationeryCost,
    watchedFields.travelCost,
    watchedFields.uniformCost,
    watchedFields.examFees,
    watchedFields.hostelFees,
    watchedFields.otherExpenses
  ])

  // Calculate progress
  useEffect(() => {
    const allFields = Object.keys(formSchema.shape)
    const filledFields = allFields.filter(field => {
      const value = watchedFields[field as keyof FormData]
      return value !== undefined && value !== '' && value !== 0
    })
    const progress = (filledFields.length / allFields.length) * 100
    onProgressChange(progress)
  }, [watchedFields, onProgressChange])

  const sections = [
    {
      title: t('personal-info-title'),
      fields: ['studentName', 'dateOfBirth', 'age', 'villageName', 'disability']
    },
    {
      title: t('education-info-title'),
      fields: ['currentEducation', 'currentYear', 'schoolName', 'otherEducation', 'futurePlans']
    },
    {
      title: t('academic-performance-title'),
      fields: ['year1Class', 'year1Marks', 'year2Class', 'year2Marks', 'year3Class', 'year3Marks', 'achievements']
    },
    {
      title: t('expenses-title'),
      fields: ['tuitionFees', 'booksCost', 'stationeryCost', 'travelCost', 'uniformCost', 'examFees', 'hostelFees', 'otherExpenses']
    },
    {
      title: t('family-info-title'),
      fields: ['fatherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer']
    },
    {
      title: t('contact-info-title'),
      fields: ['phoneNumber', 'address']
    }
  ]

  const onFormSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Application Submitted",
        description: "Your sponsorship application has been submitted successfully!",
      })
      
      onSubmit()
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="studentName">{t('name-label')}</Label>
          <Input
            id="studentName"
            {...register('studentName')}
            placeholder="Enter full name"
          />
          {errors.studentName && (
            <p className="text-sm text-red-600 mt-1">{errors.studentName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="dateOfBirth">{t('dob-label')}</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">{t('age-label')}</Label>
          <Input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
            readOnly
          />
          {errors.age && (
            <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="villageName">{t('village-label')}</Label>
          <Input
            id="villageName"
            {...register('villageName')}
            placeholder="Enter village name"
          />
          {errors.villageName && (
            <p className="text-sm text-red-600 mt-1">{errors.villageName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="disability">{t('disability-label')}</Label>
        <Select onValueChange={(value) => setValue('disability', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('no-disability')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t('no-disability')}</SelectItem>
            <SelectItem value="physical">{t('physical-disability')}</SelectItem>
            <SelectItem value="visual">{t('visual-disability')}</SelectItem>
            <SelectItem value="hearing">{t('hearing-disability')}</SelectItem>
            <SelectItem value="intellectual">{t('intellectual-disability')}</SelectItem>
            <SelectItem value="other">{t('other-disability')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderEducationInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="currentEducation">{t('current-edu-label')}</Label>
        <Select onValueChange={(value) => setValue('currentEducation', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('select-education')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">{t('primary-edu')}</SelectItem>
            <SelectItem value="secondary">{t('secondary-edu')}</SelectItem>
            <SelectItem value="higher-secondary">{t('higher-secondary-edu')}</SelectItem>
            <SelectItem value="undergraduate">{t('undergraduate-edu')}</SelectItem>
            <SelectItem value="postgraduate">{t('postgraduate-edu')}</SelectItem>
            <SelectItem value="diploma">{t('diploma-edu')}</SelectItem>
            <SelectItem value="vocational">{t('vocational-edu')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.currentEducation && (
          <p className="text-sm text-red-600 mt-1">{errors.currentEducation.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentYear">{t('year-label')}</Label>
          <Input
            id="currentYear"
            {...register('currentYear')}
            placeholder="e.g., 12th, 2nd Year B.A."
          />
          {errors.currentYear && (
            <p className="text-sm text-red-600 mt-1">{errors.currentYear.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="schoolName">{t('school-label')}</Label>
          <Input
            id="schoolName"
            {...register('schoolName')}
            placeholder="Enter institution name"
          />
          {errors.schoolName && (
            <p className="text-sm text-red-600 mt-1">{errors.schoolName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="otherEducation">{t('other-edu-label')}</Label>
        <Textarea
          id="otherEducation"
          {...register('otherEducation')}
          placeholder="Any additional courses or certifications"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="futurePlans">{t('future-plans-label')}</Label>
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

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tuitionFees">{t('tuition-label')}</Label>
          <Input
            id="tuitionFees"
            type="number"
            {...register('tuitionFees', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.tuitionFees && (
            <p className="text-sm text-red-600 mt-1">{errors.tuitionFees.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="booksCost">{t('books-label')}</Label>
          <Input
            id="booksCost"
            type="number"
            {...register('booksCost', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.booksCost && (
            <p className="text-sm text-red-600 mt-1">{errors.booksCost.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stationeryCost">{t('stationery-label')}</Label>
          <Input
            id="stationeryCost"
            type="number"
            {...register('stationeryCost', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stationeryCost && (
            <p className="text-sm text-red-600 mt-1">{errors.stationeryCost.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="travelCost">{t('travel-label')}</Label>
          <Input
            id="travelCost"
            type="number"
            {...register('travelCost', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.travelCost && (
            <p className="text-sm text-red-600 mt-1">{errors.travelCost.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="uniformCost">{t('uniform-label')}</Label>
          <Input
            id="uniformCost"
            type="number"
            {...register('uniformCost', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="examFees">{t('exam-label')}</Label>
          <Input
            id="examFees"
            type="number"
            {...register('examFees', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hostelFees">{t('hostel-label')}</Label>
          <Input
            id="hostelFees"
            type="number"
            {...register('hostelFees', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="otherExpenses">{t('other-expenses-label')}</Label>
          <Input
            id="otherExpenses"
            type="number"
            {...register('otherExpenses', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <Label className="text-lg font-semibold">{t('total-expenses-label')}</Label>
        <div className="text-2xl font-bold text-primary mt-2">
          ₹{totalExpenses.toLocaleString()}
        </div>
      </div>
    </div>
  )

  const renderFamilyInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fatherName">{t('father-name-label')}</Label>
        <Input
          id="fatherName"
          {...register('fatherName')}
          placeholder="Enter father's full name"
        />
        {errors.fatherName && (
          <p className="text-sm text-red-600 mt-1">{errors.fatherName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fatherAge">{t('father-age-label')}</Label>
          <Input
            id="fatherAge"
            type="number"
            {...register('fatherAge', { valueAsNumber: true })}
            placeholder="Age"
          />
          {errors.fatherAge && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherAge.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="fatherOccupation">{t('father-occupation-label')}</Label>
          <Input
            id="fatherOccupation"
            {...register('fatherOccupation')}
            placeholder="e.g., Farmer, Teacher, Business"
          />
          {errors.fatherOccupation && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherOccupation.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fatherIncome">{t('father-income-label')}</Label>
          <Input
            id="fatherIncome"
            type="number"
            {...register('fatherIncome', { valueAsNumber: true })}
            placeholder="Annual income"
          />
          {errors.fatherIncome && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherIncome.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="familyYearlyIncome">{t('family-income-label')}</Label>
          <Input
            id="familyYearlyIncome"
            type="number"
            {...register('familyYearlyIncome', { valueAsNumber: true })}
            placeholder="Total family income"
          />
          {errors.familyYearlyIncome && (
            <p className="text-sm text-red-600 mt-1">{errors.familyYearlyIncome.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalFamilyMembers">{t('total-members-label')}</Label>
          <Input
            id="totalFamilyMembers"
            type="number"
            {...register('totalFamilyMembers', { valueAsNumber: true })}
            placeholder="Number of members"
          />
          {errors.totalFamilyMembers && (
            <p className="text-sm text-red-600 mt-1">{errors.totalFamilyMembers.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="earningMembers">{t('earning-members-label')}</Label>
          <Input
            id="earningMembers"
            type="number"
            {...register('earningMembers', { valueAsNumber: true })}
            placeholder="Number of earning members"
          />
          {errors.earningMembers && (
            <p className="text-sm text-red-600 mt-1">{errors.earningMembers.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="educationExpenseBearer">{t('expense-bearer-label')}</Label>
        <Input
          id="educationExpenseBearer"
          {...register('educationExpenseBearer')}
          placeholder="e.g., Father, Mother, Self, Relative"
        />
        {errors.educationExpenseBearer && (
          <p className="text-sm text-red-600 mt-1">{errors.educationExpenseBearer.message}</p>
        )}
      </div>
    </div>
  )

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="phoneNumber">{t('phone-label')}</Label>
        <Input
          id="phoneNumber"
          {...register('phoneNumber')}
          placeholder="10-digit mobile number"
          maxLength={10}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">{t('address-label')}</Label>
        <Textarea
          id="address"
          {...register('address')}
          placeholder="Complete postal address with pin code"
          rows={4}
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>
    </div>
  )

  const renderSection = () => {
    switch (currentSection) {
      case 0: return renderPersonalInfo()
      case 1: return renderEducationInfo()
      case 2: return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="achievements">{t('achievements-label')}</Label>
            <Textarea
              id="achievements"
              {...register('achievements')}
              placeholder="List any awards, competitions won, or notable achievements"
              rows={4}
            />
          </div>
        </div>
      )
      case 3: return renderExpenses()
      case 4: return renderFamilyInfo()
      case 5: return renderContactInfo()
      default: return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {sections[currentSection].title}
        </h2>
        <p className="text-gray-600">
          Section {currentSection + 1} of {sections.length}
        </p>
      </div>

      <Separator />

      {/* Form Content */}
      <div className="min-h-[400px]">
        {renderSection()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 0}
        >
          {t('prev-btn')}
        </Button>

        <div className="flex gap-2">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSection
                  ? 'bg-primary'
                  : index < currentSection
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentSection === sections.length - 1 ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : t('submit-btn')}
          </Button>
        ) : (
          <Button type="button" onClick={nextSection}>
            {t('next-btn')}
          </Button>
        )}
      </div>
    </form>
  )
}