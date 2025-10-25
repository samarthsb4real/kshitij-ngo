"use client"

import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { RefreshCw } from 'lucide-react'
import { useLanguage } from './language-provider'
import { useToast } from '@/hooks/use-toast'
import { saveFormSubmission } from '@/lib/excel-utils'

const formSchema = z.object({
  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
  middleName: z.string()
    .max(50, 'Middle name is too long')
    .regex(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces')
    .optional(),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces'),
  photo: z.string()
    .min(1, 'Photo is required')
    .refine((data) => {
      if (!data.startsWith('data:image/')) return false
      const sizeInBytes = (data.length * 3) / 4 - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0)
      return sizeInBytes <= 5 * 1024 * 1024 // 5MB limit
    }, 'Photo must be a valid image under 5MB'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 10 && age <= 21
    }, 'Student must be between 10-21 years old'),
  age: z.number()
    .int('Age must be a whole number')
    .min(10, 'Student must be at least 10 years old')
    .max(21, 'Student must be 21 years or younger'),
  villageName: z.string().min(1, 'Village selection is required'),
  disability: z.string().optional(),
  
  // Education Information
  currentEducation: z.string().min(1, 'Current education level is required'),
  currentYear: z.string()
    .min(1, 'Current year/class is required')
    .max(50, 'Class/year is too long')
    .trim(),
  schoolName: z.string()
    .min(3, 'School/college name must be at least 3 characters')
    .max(200, 'School name is too long')
    .trim(),
  otherEducation: z.string().max(500, 'Description is too long').optional(),
  futurePlans: z.string()
    .min(10, 'Please describe your future plans (at least 10 characters)')
    .max(1000, 'Description is too long')
    .trim(),
  
  // Academic Performance
  year1Class: z.string().max(50).optional(),
  year1Marks: z.number()
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100%')
    .optional(),
  year2Class: z.string().max(50).optional(),
  year2Marks: z.number()
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100%')
    .optional(),
  year3Class: z.string().max(50).optional(),
  year3Marks: z.number()
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100%')
    .optional(),
  achievements: z.string().max(1000, 'Description is too long').optional(),
  
  // Expenses - All required with proper validation
  tuitionFees: z.number()
    .min(0, 'Tuition fees cannot be negative')
    .max(1000000, 'Amount seems too high')
    .finite('Must be a valid number'),
  booksCost: z.number()
    .min(0, 'Books cost cannot be negative')
    .max(100000, 'Amount seems too high')
    .finite('Must be a valid number'),
  stationeryCost: z.number()
    .min(0, 'Stationery cost cannot be negative')
    .max(50000, 'Amount seems too high')
    .finite('Must be a valid number'),
  travelCost: z.number()
    .min(0, 'Travel cost cannot be negative')
    .max(100000, 'Amount seems too high')
    .finite('Must be a valid number'),
  uniformCost: z.number()
    .min(0, 'Uniform cost cannot be negative')
    .max(50000, 'Amount seems too high')
    .finite('Must be a valid number')
    .default(0),
  examFees: z.number()
    .min(0, 'Exam fees cannot be negative')
    .max(100000, 'Amount seems too high')
    .finite('Must be a valid number')
    .default(0),
  hostelFees: z.number()
    .min(0, 'Hostel fees cannot be negative')
    .max(500000, 'Amount seems too high')
    .finite('Must be a valid number')
    .default(0),
  otherExpenses: z.number()
    .min(0, 'Other expenses cannot be negative')
    .max(100000, 'Amount seems too high')
    .finite('Must be a valid number')
    .default(0),
  
  // Family Information
  fatherName: z.string()
    .min(2, 'Father\'s name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces')
    .trim(),
  motherName: z.string()
    .min(2, 'Mother\'s name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces')
    .trim(),
  fatherAge: z.number()
    .int('Age must be a whole number')
    .min(25, 'Father\'s age must be at least 25')
    .max(100, 'Please enter a valid age'),
  fatherOccupation: z.string()
    .min(2, 'Father\'s occupation is required')
    .max(100, 'Occupation description is too long')
    .trim(),
  fatherIncome: z.number()
    .min(0, 'Income cannot be negative')
    .max(10000000, 'Amount seems too high')
    .finite('Must be a valid number'),
  familyYearlyIncome: z.number()
    .min(0, 'Family income cannot be negative')
    .max(10000000, 'Amount seems too high')
    .finite('Must be a valid number'),
  totalFamilyMembers: z.number()
    .int('Must be a whole number')
    .min(1, 'At least 1 family member required')
    .max(50, 'Please enter a valid number'),
  earningMembers: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(20, 'Please enter a valid number'),
  educationExpenseBearer: z.string()
    .min(2, 'Please specify who bears education expenses')
    .max(100, 'Description is too long')
    .trim(),
  
  // Contact Information
  phoneNumber: z.string()
    .regex(/^[6-9][0-9]{9}$/, 'Enter valid 10-digit Indian mobile number')
    .length(10, 'Phone number must be exactly 10 digits'),
  address: z.string()
    .min(10, 'Please provide complete address (at least 10 characters)')
    .max(500, 'Address is too long')
    .trim(),
  pincode: z.string()
    .regex(/^[1-9][0-9]{5}$/, 'Enter valid 6-digit pincode')
    .length(6, 'Pincode must be exactly 6 digits')
}).refine((data) => data.earningMembers <= data.totalFamilyMembers, {
  message: 'Earning members cannot exceed total family members',
  path: ['earningMembers'],
}).refine((data) => data.fatherIncome <= data.familyYearlyIncome, {
  message: 'Father\'s income cannot exceed total family income',
  path: ['fatherIncome'],
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
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const villages = [
    'Kondhur', 'Wanjale', 'Shivapur', 'Karjat', 'Mulshi', 'Tamhini', 'Paud', 'Sus', 'Bavdhan', 'Warje'
  ]

  const educationStreams = [
    { value: '5th', label: '5th Standard' },
    { value: '6th', label: '6th Standard' },
    { value: '7th', label: '7th Standard' },
    { value: '8th', label: '8th Standard' },
    { value: '9th', label: '9th Standard' },
    { value: '10th', label: '10th Standard' },
    { value: '11th-science', label: '11th Science (PCM/PCB)' },
    { value: '11th-commerce', label: '11th Commerce' },
    { value: '11th-arts', label: '11th Arts' },
    { value: '12th-science', label: '12th Science (PCM/PCB)' },
    { value: '12th-commerce', label: '12th Commerce' },
    { value: '12th-arts', label: '12th Arts' },
    { value: 'ba', label: 'B.A. (Bachelor of Arts)' },
    { value: 'bsc', label: 'B.Sc. (Bachelor of Science)' },
    { value: 'bcom', label: 'B.Com. (Bachelor of Commerce)' },
    { value: 'bba', label: 'BBA (Bachelor of Business Administration)' },
    { value: 'btech', label: 'B.Tech (Bachelor of Technology)' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'ma', label: 'M.A. (Master of Arts)' },
    { value: 'msc', label: 'M.Sc. (Master of Science)' },
    { value: 'mcom', label: 'M.Com. (Master of Commerce)' },
    { value: 'mba', label: 'MBA (Master of Business Administration)' }
  ]

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

  // Calculate age from date of birth with proper validation
  useEffect(() => {
    const dob = watchedFields.dateOfBirth
    if (dob) {
      const birthDate = new Date(dob)
      const today = new Date()
      
      // Validate date is not in future
      if (birthDate > today) {
        setValue('age', 0)
        return
      }
      
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age >= 0 && age <= 150) {
        setValue('age', age)
      }
    }
  }, [watchedFields.dateOfBirth, setValue])

  // Calculate total expenses with validation
  useEffect(() => {
    const expenses = [
      Number(watchedFields.tuitionFees) || 0,
      Number(watchedFields.booksCost) || 0,
      Number(watchedFields.stationeryCost) || 0,
      Number(watchedFields.travelCost) || 0,
      Number(watchedFields.uniformCost) || 0,
      Number(watchedFields.examFees) || 0,
      Number(watchedFields.hostelFees) || 0,
      Number(watchedFields.otherExpenses) || 0
    ]
    
    // Validate all expenses are finite numbers
    const validExpenses = expenses.filter(exp => Number.isFinite(exp) && exp >= 0)
    const total = validExpenses.reduce((sum, expense) => sum + expense, 0)
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

  // Auto-fill academic years based on current education
  useEffect(() => {
    const currentEdu = watchedFields.currentEducation
    if (currentEdu) {
      if (currentEdu === '5th') {
        setValue('year1Class', '5th')
        setValue('year2Class', '4th')
        setValue('year3Class', '3rd')
      } else if (currentEdu === '6th') {
        setValue('year1Class', '6th')
        setValue('year2Class', '5th')
        setValue('year3Class', '4th')
      } else if (currentEdu === '7th') {
        setValue('year1Class', '7th')
        setValue('year2Class', '6th')
        setValue('year3Class', '5th')
      } else if (currentEdu === '8th') {
        setValue('year1Class', '8th')
        setValue('year2Class', '7th')
        setValue('year3Class', '6th')
      } else if (currentEdu === '9th') {
        setValue('year1Class', '9th')
        setValue('year2Class', '8th')
        setValue('year3Class', '7th')
      } else if (currentEdu === '10th') {
        setValue('year1Class', '10th')
        setValue('year2Class', '9th')
        setValue('year3Class', '8th')
      } else if (currentEdu.startsWith('11th')) {
        setValue('year1Class', '11th')
        setValue('year2Class', '10th')
        setValue('year3Class', '9th')
      } else if (currentEdu.startsWith('12th')) {
        setValue('year1Class', '12th')
        setValue('year2Class', '11th')
        setValue('year3Class', '10th')
      } else if (['ba', 'bsc', 'bcom', 'bba', 'btech', 'diploma'].includes(currentEdu)) {
        setValue('year1Class', '1st Year College')
        setValue('year2Class', '12th')
        setValue('year3Class', '11th')
      } else if (['ma', 'msc', 'mcom', 'mba'].includes(currentEdu)) {
        setValue('year1Class', '1st Year PG')
        setValue('year2Class', 'Final Year UG')
        setValue('year3Class', '2nd Year UG')
      }
    }
  }, [watchedFields.currentEducation, setValue])

  // Calculate progress
  const requiredFields = useMemo(() => [
    'firstName', 'lastName', 'photo', 'dateOfBirth', 'age', 'villageName',
    'currentEducation', 'currentYear', 'schoolName', 'futurePlans',
    'tuitionFees', 'booksCost', 'stationeryCost', 'travelCost',
    'fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome',
    'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer',
    'phoneNumber', 'address', 'pincode'
  ], [])

  useEffect(() => {
    const filledCount = requiredFields.filter(field => {
      const value = watchedFields[field as keyof FormData]
      if (typeof value === 'number') {
        return value !== undefined && !isNaN(value)
      }
      return value !== undefined && value !== ''
    }).length
    
    const progress = (filledCount / requiredFields.length) * 100
    onProgressChange(progress)
  }, [watchedFields, onProgressChange, requiredFields])

  const sections = [
    {
      title: t('personal-info-title'),
      fields: ['firstName', 'middleName', 'lastName', 'photo', 'dateOfBirth', 'age', 'villageName', 'disability']
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
      fields: ['phoneNumber', 'address', 'pincode']
    }
  ]

  const onFormSubmit = async (data: FormData) => {
    setIsSubmittingForm(true)
    
    try {
      // Validate all required fields are present
      const requiredFields = ['firstName', 'lastName', 'photo', 'dateOfBirth', 'villageName', 'currentEducation', 'currentYear', 'schoolName', 'futurePlans', 'fatherName', 'motherName', 'fatherOccupation', 'phoneNumber', 'address', 'pincode']
      const missingFields = requiredFields.filter(field => {
        const value = data[field as keyof FormData]
        return !value || (typeof value === 'string' && value.trim() === '')
      })
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Calculate total expenses with validation
      const expenseFields = [data.tuitionFees, data.booksCost, data.stationeryCost, data.travelCost, data.uniformCost, data.examFees, data.hostelFees, data.otherExpenses]
      const calculatedTotal = expenseFields.reduce((sum, expense) => {
        const num = Number(expense) || 0
        return Number.isFinite(num) && num >= 0 ? sum + num : sum
      }, 0)

      // Validate total expenses is reasonable
      if (calculatedTotal > data.familyYearlyIncome * 2) {
        toast({
          title: "Warning",
          description: "Education expenses seem very high compared to family income. Please verify the amounts.",
          variant: "destructive",
        })
      }

      // Save to localStorage first
      const submissionId = saveFormSubmission({
        studentName: `${data.firstName} ${data.middleName || ''} ${data.lastName}`.trim(),
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

      // Submit to Google Sheets with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 seconds for photo upload
      
      // Sanitize data before submission - include photo
      const sanitizedData = {
        ...data,
        studentName: `${data.firstName.trim()} ${(data.middleName || '').trim()} ${data.lastName.trim()}`.replace(/\s+/g, ' ').trim(),
        totalExpenses: calculatedTotal,
        // Sanitize text fields
        firstName: data.firstName.trim(),
        middleName: data.middleName?.trim() || '',
        lastName: data.lastName.trim(),
        address: data.address.trim(),
        fatherName: data.fatherName.trim(),
        motherName: data.motherName.trim(),
        fatherOccupation: data.fatherOccupation.trim(),
        educationExpenseBearer: data.educationExpenseBearer.trim(),
        // Include the compressed photo
        photo: data.photo
      }
      
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
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
      
      reset()
      setCurrentSection(0)
      onSubmit()
      
    } catch (error) {
      console.error('Form submission error:', error)
      
      const errorMessage = error instanceof Error 
        ? error.name === 'AbortError' 
          ? 'Request timed out. Your application has been saved locally and will be synced later.'
          : error.message.includes('fetch') 
            ? 'Network error. Your application has been saved locally and will be synced when connection is restored.'
            : error.message
        : 'There was an error submitting your application. Please try again.'
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const isSectionValid = () => {
    const currentFields = sections[currentSection].fields
    const hasErrors = currentFields.some(field => errors[field as keyof FormData])
    
    const sectionRequiredFields = {
      0: ['firstName', 'lastName', 'photo', 'dateOfBirth', 'villageName'],
      1: ['currentEducation', 'currentYear', 'schoolName', 'futurePlans'],
      2: [], // Academic performance is optional
      3: ['tuitionFees', 'booksCost', 'stationeryCost', 'travelCost'],
      4: ['fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer'],
      5: ['phoneNumber', 'address', 'pincode']
    }
    
    const requiredForSection = sectionRequiredFields[currentSection as keyof typeof sectionRequiredFields] || []
    const requiredFieldsFilled = requiredForSection.every(field => {
      const value = watchedFields[field as keyof FormData]
      if (typeof value === 'number') {
        return value !== undefined && !isNaN(value)
      }
      return value !== undefined && value !== ''
    })
    
    return !hasErrors && (requiredForSection.length === 0 || requiredFieldsFilled)
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

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Security validations
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPEG, PNG, or WebP images",
        variant: "destructive"
      })
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
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

  const renderPersonalInfo = () => (
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
          <Label htmlFor="middleName">Middle Name</Label>
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
            className="bg-gray-50"
          />
          {errors.age && (
            <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="villageName">{t('village-label')}</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentYear">{t('year-label')}</Label>
          <Input
            id="currentYear"
            {...register('currentYear')}
            placeholder="e.g., 12th, 2nd Year B.A."
            autoComplete="off"
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
            autoComplete="off"
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
            min="0"
            step="1"
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
            min="0"
            step="1"
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
            min="0"
            step="1"
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
            min="0"
            step="1"
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
            min="0"
            step="1"
            {...register('uniformCost', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="examFees">{t('exam-label')}</Label>
          <Input
            id="examFees"
            type="number"
            min="0"
            step="1"
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
            min="0"
            step="1"
            {...register('hostelFees', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
        
        <div>
          <Label htmlFor="otherExpenses">{t('other-expenses-label')}</Label>
          <Input
            id="otherExpenses"
            type="number"
            min="0"
            step="1"
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
            autoComplete="off"
          />
          {errors.fatherName && (
            <p className="text-sm text-red-600 mt-1">{errors.fatherName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="motherName">{t('mother-name-label')}</Label>
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
          <Label htmlFor="fatherAge">{t('father-age-label')}</Label>
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
          <Label htmlFor="fatherOccupation">{t('father-occupation-label')}</Label>
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
          <Label htmlFor="fatherIncome">{t('father-income-label')}</Label>
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
          <Label htmlFor="familyYearlyIncome">{t('family-income-label')}</Label>
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
          <Label htmlFor="totalFamilyMembers">{t('total-members-label')}</Label>
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
          <Label htmlFor="earningMembers">{t('earning-members-label')}</Label>
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
        <Label htmlFor="educationExpenseBearer">{t('expense-bearer-label')}</Label>
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

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="phoneNumber">{t('phone-label')}</Label>
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

      <div>
        <Label htmlFor="address">{t('address-label')}</Label>
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
            <Label htmlFor="year2Marks">Marks (Percentage %)</Label>
            <Input
              id="year2Marks"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register('year2Marks', { valueAsNumber: true })}
              placeholder="e.g., 80.5"
            />
            {errors.year2Marks && (
              <p className="text-sm text-red-600 mt-1">{errors.year2Marks.message}</p>
            )}
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
            <Label htmlFor="year3Marks">Marks (Percentage %)</Label>
            <Input
              id="year3Marks"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register('year3Marks', { valueAsNumber: true })}
              placeholder="e.g., 75.5"
            />
            {errors.year3Marks && (
              <p className="text-sm text-red-600 mt-1">{errors.year3Marks.message}</p>
            )}
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8" autoComplete="off">
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
      <div className="h-[500px] md:h-[450px] overflow-y-auto px-1">
        {renderSection()}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 0}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          {t('prev-btn')}
        </Button>

        <div className="flex gap-2 order-1 sm:order-2">
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
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-3">
            <Button 
              type="submit" 
              disabled={isSubmittingForm || !isSectionValid()} 
              className="w-full sm:w-auto"
            >
              {isSubmittingForm ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              disabled={isSubmittingForm}
              onClick={() => {
                if (confirm('Are you sure you want to clear all form data?')) {
                  reset()
                  setCurrentSection(0)
                  toast({ title: "Form Cleared", description: "All fields have been reset" })
                }
              }}
              className="w-full sm:w-auto"
            >
              Clear Form
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={nextSection} disabled={!isSectionValid()} className="w-full sm:w-auto order-3">
            {t('next-btn')}
          </Button>
        )}
      </div>
    </form>
  )
}