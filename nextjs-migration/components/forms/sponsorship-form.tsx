"use client"

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from './language-provider'
import { useToast } from '@/hooks/use-toast'
import { saveFormSubmission } from '@/lib/excel-utils'

const formSchema = z.object({
  // Personal Information
  studentName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.number()
    .min(10, 'Student must be at least 10 years old')
    .max(21, 'Student must be 21 years or younger to be eligible'),
  villageName: z.string()
    .min(2, 'Village name is required')
    .max(100, 'Village name is too long'),
  disability: z.string().optional(),
  
  // Education Information
  currentEducation: z.string().min(1, 'Current education level is required'),
  currentYear: z.string()
    .min(1, 'Current year/class is required')
    .max(50, 'Class/year is too long'),
  schoolName: z.string()
    .min(3, 'School/college name must be at least 3 characters')
    .max(200, 'School name is too long'),
  otherEducation: z.string().max(500, 'Description is too long').optional(),
  futurePlans: z.string()
    .min(10, 'Please describe your future plans (at least 10 characters)')
    .max(1000, 'Description is too long'),
  
  // Academic Performance
  year1Class: z.string().max(50).optional(),
  year1Marks: z.string().max(20).optional(),
  year2Class: z.string().max(50).optional(),
  year2Marks: z.string().max(20).optional(),
  year3Class: z.string().max(50).optional(),
  year3Marks: z.string().max(20).optional(),
  achievements: z.string().max(1000, 'Description is too long').optional(),
  
  // Expenses
  tuitionFees: z.number()
    .min(0, 'Tuition fees cannot be negative')
    .max(1000000, 'Amount seems too high'),
  booksCost: z.number()
    .min(0, 'Books cost cannot be negative')
    .max(100000, 'Amount seems too high'),
  stationeryCost: z.number()
    .min(0, 'Stationery cost cannot be negative')
    .max(50000, 'Amount seems too high'),
  travelCost: z.number()
    .min(0, 'Travel cost cannot be negative')
    .max(100000, 'Amount seems too high'),
  uniformCost: z.number().min(0).max(50000).optional(),
  examFees: z.number().min(0).max(100000).optional(),
  hostelFees: z.number().min(0).max(500000).optional(),
  otherExpenses: z.number().min(0).max(100000).optional(),
  
  // Family Information
  fatherName: z.string()
    .min(2, 'Father\'s name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters'),
  motherName: z.string()
    .min(2, 'Mother\'s name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters'),
  fatherAge: z.number()
    .min(25, 'Father\'s age must be at least 25')
    .max(100, 'Please enter a valid age'),
  fatherOccupation: z.string()
    .min(2, 'Father\'s occupation is required')
    .max(100, 'Occupation description is too long'),
  fatherIncome: z.number()
    .min(0, 'Income cannot be negative')
    .max(10000000, 'Amount seems too high'),
  familyYearlyIncome: z.number()
    .min(0, 'Family income cannot be negative')
    .max(10000000, 'Amount seems too high'),
  totalFamilyMembers: z.number()
    .min(1, 'At least 1 family member required')
    .max(50, 'Please enter a valid number'),
  earningMembers: z.number()
    .min(0, 'Cannot be negative')
    .max(20, 'Please enter a valid number'),
  educationExpenseBearer: z.string()
    .min(2, 'Please specify who bears education expenses')
    .max(100, 'Description is too long'),
  
  // Contact Information
  phoneNumber: z.string()
    .regex(/^[6-9][0-9]{9}$/, 'Enter valid 10-digit Indian mobile number'),
  address: z.string()
    .min(10, 'Please provide complete address (at least 10 characters)')
    .max(500, 'Address is too long')
}).refine((data) => data.earningMembers <= data.totalFamilyMembers, {
  message: 'Earning members cannot exceed total family members',
  path: ['earningMembers'],
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
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      tuitionFees: 0,
      booksCost: 0,
      stationeryCost: 0,
      travelCost: 0,
      uniformCost: 0,
      examFees: 0,
      hostelFees: 0,
      otherExpenses: 0
    }
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
      
      if (age > 0) {
        setValue('age', age)
        
        if (age < 10 || age > 21) {
          toast({
            title: "Ineligible for Sponsorship",
            description: `Student age is ${age} years. Only students aged 10-21 are eligible for this program.`,
            variant: "destructive",
          })
        }
      }
    }
  }, [watchedFields.dateOfBirth, setValue, toast])

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
    const requiredFields = [
      'studentName', 'dateOfBirth', 'age', 'villageName',
      'currentEducation', 'currentYear', 'schoolName', 'futurePlans',
      'tuitionFees', 'booksCost', 'stationeryCost', 'travelCost',
      'fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome',
      'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer',
      'phoneNumber', 'address'
    ]
    
    const filledCount = requiredFields.filter(field => {
      const value = watchedFields[field as keyof FormData]
      return value !== undefined && value !== '' && value !== 0
    }).length
    
    const progress = (filledCount / requiredFields.length) * 100
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

  const onFormSubmit = async (data: FormData, shouldReset = true) => {
    setIsSubmittingForm(true)
    try {
      // Check age eligibility
      if (data.age < 10 || data.age > 21) {
        setIsSubmittingForm(false)
        toast({
          title: "Submission Failed - Ineligible",
          description: `Student age is ${data.age} years. Only students aged 10-21 are eligible for sponsorship.`,
          variant: "destructive",
        })
        return
      }
      
      // Calculate total expenses
      const calculatedTotal = [
        data.tuitionFees || 0,
        data.booksCost || 0,
        data.stationeryCost || 0,
        data.travelCost || 0,
        data.uniformCost || 0,
        data.examFees || 0,
        data.hostelFees || 0,
        data.otherExpenses || 0
      ].reduce((sum, expense) => sum + Number(expense), 0)

      // Save to localStorage first
      const submissionId = saveFormSubmission({
        studentName: data.studentName,
        age: data.age,
        class: data.currentYear,
        village: data.villageName,
        school: data.schoolName,
        currentEducation: data.currentEducation,
        fatherName: data.fatherName,
        motherName: data.motherName,
        parentAge: data.fatherAge?.toString() || '',
        parentEducation: '',
        familyMembers: data.totalFamilyMembers,
        earningMembers: data.earningMembers,
        annualIncome: data.familyYearlyIncome,
        incomeSource: data.fatherOccupation,
        phone: data.phoneNumber,
        address: data.address,
        futurePlans: data.futurePlans,
        needsHelp: 'Yes',
        expenses: {
          travel: data.travelCost || 0,
          fees: data.tuitionFees || 0,
          books: data.booksCost || 0,
          stationery: data.stationeryCost || 0,
          uniform: data.uniformCost || 0,
          tuition: data.examFees || 0,
          other: (data.hostelFees || 0) + (data.otherExpenses || 0)
        },
        totalExpenses: calculatedTotal
      })

      // Submit to Google Sheets
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          motherName: data.motherName,
          totalExpenses: calculatedTotal
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }
      
      toast({
        title: "Application Submitted Successfully!",
        description: result.googleSheetsSuccess 
          ? `Saved to Google Sheets and locally (ID: ${submissionId})`
          : `Saved locally (ID: ${submissionId}). Google Sheets sync may be delayed.`,
      })
      
      if (shouldReset) {
        reset()
        setCurrentSection(0)
        onSubmit()
      }
      setIsSubmittingForm(false)
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
      setIsSubmittingForm(false)
    }
  }

  const isSectionValid = () => {
    const currentFields = sections[currentSection].fields
    return !currentFields.some(field => errors[field as keyof FormData])
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <Controller
          name="disability"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
      </div>
    </div>
  )

  const renderEducationInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="currentEducation">{t('current-edu-label')}</Label>
        <Controller
          name="currentEducation"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div>
          <Label htmlFor="motherName">Mother's Name *</Label>
          <Input
            id="motherName"
            {...register('motherName')}
            placeholder="Enter mother's full name"
          />
          {errors.motherName && (
            <p className="text-sm text-red-600 mt-1">{errors.motherName.message}</p>
          )}
        </div>
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

  const renderAcademicPerformance = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Most Recent Year</h3>
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
            <Label htmlFor="year1Marks">Marks/Percentage</Label>
            <Input
              id="year1Marks"
              {...register('year1Marks')}
              placeholder="e.g., 85%, 450/500"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Second Recent Year</h3>
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
            <Label htmlFor="year2Marks">Marks/Percentage</Label>
            <Input
              id="year2Marks"
              {...register('year2Marks')}
              placeholder="e.g., 80%, 420/500"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Third Recent Year</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year3Class">Class/Year</Label>
            <Input
              id="year3Class"
              {...register('year3Class')}
              placeholder="e.g., 10th, SSC"
            />
          </div>
          <div>
            <Label htmlFor="year3Marks">Marks/Percentage</Label>
            <Input
              id="year3Marks"
              {...register('year3Marks')}
              placeholder="e.g., 75%, 400/500"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="achievements">Achievements and Awards</Label>
        <Textarea
          id="achievements"
          {...register('achievements')}
          placeholder="List any awards, competitions won, or notable achievements"
          rows={4}
        />
      </div>
    </div>
  )

  const renderSection = () => {
    switch (currentSection) {
      case 0: return renderPersonalInfo()
      case 1: return renderEducationInfo()
      case 2: return renderAcademicPerformance()
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
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSection
                  ? 'bg-primary w-8'
                  : index < currentSection
                  ? 'bg-green-500 cursor-pointer hover:scale-125'
                  : 'bg-gray-300'
              }`}
              title={`Go to ${sections[index].title}`}
            />
          ))}
        </div>

        {currentSection === sections.length - 1 ? (
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? 'Submitting...' : 'Submit'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              disabled={isSubmittingForm}
              onClick={() => {
                reset()
                setCurrentSection(0)
                toast({ title: "Form Cleared", description: "All fields have been reset" })
              }}
            >
              Clear Form
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={nextSection} disabled={!isSectionValid()}>
            {t('next-btn')}
          </Button>
        )}
      </div>
    </form>
  )
}