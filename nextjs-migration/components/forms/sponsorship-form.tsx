"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, type FormData } from '@/lib/form-schema'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RefreshCw } from 'lucide-react'
import { useLanguage } from './language-provider'
import { useToast } from '@/hooks/use-toast'

import { validateSectionFields, calculateAge, generateRecentYears } from '@/lib/form-utils'

// Import modular section components
import { PersonalInfoSection } from './sections/personal-info-section'
import { EducationInfoSection } from './sections/education-info-section'
import { AcademicPerformanceSection } from './sections/academic-performance-section'
import { ExpensesSection } from './sections/expenses-section'
import { FamilyInfoSection } from './sections/family-info-section'
import { ContactInfoSection } from './sections/contact-info-section'

interface SponsorshipFormProps {
  language: string
  onProgressChange: (progress: number) => void
  onSubmit: () => void
}

export function SponsorshipForm({ language, onProgressChange, onSubmit }: SponsorshipFormProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [currentSection, setCurrentSection] = useState(0)
  const [debugMessage, setDebugMessage] = useState<string>('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  // Form sections configuration
  const sections = [
    { title: 'Personal Information', component: 'personal' },
    { title: 'Education Information', component: 'education' },
    { title: 'Academic Performance', component: 'academic' },
    { title: 'Educational Expenses', component: 'expenses' },
    { title: 'Family Information', component: 'family' },
    { title: 'Contact Information', component: 'contact' }
  ]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      // Personal information
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      aadharNumber: '',
      photo: '',
      dateOfBirth: '',
      age: 10, // Default to minimum valid age
      villageName: '',
      disability: '',
      
      // Education information
      currentEducation: '',
      schoolName: '',
      otherEducation: '',
      futurePlans: '',
      
      // Academic performance
      year1Class: '',
      year1Marks: 0,
      year2Class: '',
      year2Marks: 0,
      year3Class: '',
      year3Marks: 0,
      achievements: '',
      
      // Expense fields
      tuitionFees: 0,
      booksCost: 0,
      stationeryCost: 0,
      travelCost: 0,
      uniformCost: 0,
      examFees: 0,
      hostelFees: 0,
      otherExpenses: 0,
      
      // Family information
      fatherName: '',
      motherName: '',
      fatherAge: 0,
      fatherOccupation: '',
      fatherIncome: 0,
      familyYearlyIncome: 0,
      totalFamilyMembers: 0,
      earningMembers: 0,
      educationExpenseBearer: '',
      
      // Contact information
      phoneNumber: '',
      alternatePhone: '',
      email: '',
      address: '',
      pincode: ''
    }
  })

  const watchedFields = watch()
  const dateOfBirth = watch('dateOfBirth')
  const currentEducation = watch('currentEducation')

  // Auto-calculate age when dateOfBirth changes
  useEffect(() => {
    if (dateOfBirth) {
      const calculatedAge = calculateAge(dateOfBirth)
      if (calculatedAge >= 9 && calculatedAge <= 21) {
        setValue('age', calculatedAge, { shouldValidate: true })
      }
    }
  }, [dateOfBirth, setValue])

  // Auto-fill recent years when currentEducation changes
  useEffect(() => {
    if (currentEducation && currentEducation !== 'other') {
      const recentYears = generateRecentYears(currentEducation)
      setValue('year1Class', recentYears[0], { shouldValidate: true })
      setValue('year2Class', recentYears[1], { shouldValidate: true })
      setValue('year3Class', recentYears[2], { shouldValidate: true })
    }
  }, [currentEducation, setValue])

  // Calculate progress based on current section
  const progress = ((currentSection + 1) / sections.length) * 100

  // Update progress when section changes
  useEffect(() => {
    onProgressChange(progress)
  }, [currentSection, progress, onProgressChange])

  // Validate current section before moving to next
  const validateCurrentSection = async () => {
    const sectionFields = getSectionFields(currentSection)
    
    // If no required fields in section, allow progression
    if (sectionFields.length === 0) {
      return true
    }
    
    // Validate required fields
    const validationResults = await Promise.all(
      sectionFields.map(field => trigger(field as keyof FormData))
    )
    
    // Check if all required fields are filled and valid
    const allFieldsValid = sectionFields.every(field => {
      const value = watchedFields[field as keyof FormData]
      if (typeof value === 'number') {
        return value !== undefined && !isNaN(value) && value >= 0
      }
      return value !== undefined && value !== '' && value !== null
    })
    
    return validationResults.every(Boolean) && allFieldsValid
  }

  // Get required fields for each section
  const getSectionFields = (sectionIndex: number): string[] => {
    switch (sectionIndex) {
      case 0: // Personal Information - disability and village mandatory
        return ['firstName', 'lastName', 'gender', 'photo', 'dateOfBirth', 'age', 'villageName', 'disability']
      case 1: // Education Information - all fields mandatory
        const eduFields = ['currentEducation', 'schoolName', 'futurePlans']
        return watchedFields.currentEducation === 'other' ? [...eduFields, 'otherEducation'] : eduFields
      case 2: // Academic Performance - all 3 years mandatory
        return ['year1Class', 'year1Marks', 'year2Class', 'year2Marks', 'year3Class', 'year3Marks']
      case 3: // Educational Expenses - first 4 fields required
        return ['tuitionFees', 'booksCost', 'stationeryCost', 'travelCost']
      case 4: // Family Information - all required
        return ['fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer']
      case 5: // Contact Information - phone and address required
        return ['phoneNumber', 'address']
      default:
        return []
    }
  }

  // Navigation functions
  const goToNextSection = async () => {
    const isValid = await validateCurrentSection()
    if (!isValid) {
      // Check which specific fields are invalid
      const sectionFields = getSectionFields(currentSection)
      const invalidFields: string[] = []
      
      for (const field of sectionFields) {
        const value = watchedFields[field as keyof FormData]
        const hasError = errors[field as keyof FormData]
        
        if (hasError || value === undefined || value === '' || value === null || 
            (typeof value === 'number' && (isNaN(value) || value < 0))) {
          invalidFields.push(field)
        }
      }
      
      const message = invalidFields.length > 0 
        ? `Please fix these fields: ${invalidFields.join(', ')}`
        : "Please fill in all required fields correctly before proceeding."
        
      toast({
        title: "Section Validation Error",
        description: message,
        variant: "destructive"
      })
      
      // Focus first invalid field
      if (invalidFields.length > 0) {
        setTimeout(() => {
          const firstInvalidField = document.querySelector(`[name="${invalidFields[0]}"]`) as HTMLElement
          if (firstInvalidField) {
            firstInvalidField.focus()
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      }
      return
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Form submission
  // Handler for react-hook-form validation errors (passed as onError to handleSubmit)
  const handleValidationErrors = (errors: any) => {
    console.warn('Validation errors:', errors)
    
    // Get the first error to show to the user
    const errorKeys = Object.keys(errors || {})
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0]
      const firstError = errors[firstErrorKey]
      const errorMessage = firstError?.message || `${firstErrorKey} is required`
      
      setDebugMessage(`${firstErrorKey}: ${errorMessage}`)
      
      toast({
        title: "Please Fix Validation Errors",
        description: errorMessage,
        variant: "destructive"
      })
      
      // Try to focus the first error field
      setTimeout(() => {
        const errorField = document.querySelector(`[name="${firstErrorKey}"]`) as HTMLElement
        if (errorField) {
          errorField.focus()
          errorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    } else {
      setDebugMessage('Please fix all validation errors before submitting.')
      toast({
        title: "Form Validation Failed",
        description: "Please check all required fields and fix any errors before submitting.",
        variant: "destructive"
      })
    }
  }

  const onFormSubmit = async (data: FormData) => {
    console.log('🚀 onFormSubmit called - validation passed! Data:', data)
    setIsSubmittingForm(true)

    let submitButton: HTMLButtonElement | null = null
    try {
      // Prevent duplicate submissions
      submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
      if (submitButton) {
        submitButton.disabled = true
      }

      // Submit to API endpoint
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      // If server returned non-OK or success=false, throw with server message
      if (!response.ok || (result && result.success === false)) {
        throw new Error(result?.error || result?.message || 'Submission failed')
      }

      toast({
        title: "Application Submitted Successfully!",
        description: "Your sponsorship application has been recorded. We will contact you soon.",
      })

      // Reset form and call onSubmit callback
      reset()
      setCurrentSection(0)
      onSubmit()

    } catch (error) {
      console.error('Form submission error:', error)
      const message = (error as any)?.message || 'There was an error submitting your application. Please try again.'
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive"
      })

      // Re-enable submit button on error
      if (submitButton) {
        submitButton.disabled = false
      }
    } finally {
      setIsSubmittingForm(false)
    }
  }

  // Render current section component
  const renderCurrentSection = () => {
    const commonProps = {
      register,
      control,
      errors,
      setValue,
      watch
    }

    switch (currentSection) {
      case 0:
        return <PersonalInfoSection {...commonProps} />
      case 1:
        return <EducationInfoSection {...commonProps} />
      case 2:
        return <AcademicPerformanceSection {...commonProps} />
      case 3:
        return <ExpensesSection {...commonProps} />
      case 4:
        return <FamilyInfoSection {...commonProps} />
      case 5:
        return <ContactInfoSection {...commonProps} />
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit, handleValidationErrors)} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with section title and progress */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {sections[currentSection].title}
        </h2>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Step {currentSection + 1} of {sections.length}</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {debugMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {debugMessage}
            </div>
          )}
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <Separator />

      {/* Current section content */}
      <div className="min-h-[400px]">
        {renderCurrentSection()}
      </div>

      <Separator />

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousSection}
          disabled={currentSection === 0}
          className="flex items-center space-x-2"
        >
          <span>← Previous</span>
        </Button>

        <div className="flex space-x-2">
          {currentSection === sections.length - 1 ? (
            <Button
              type="submit"
              disabled={isSubmitting || isSubmittingForm}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              onClick={() => console.log('🎯 Submit button clicked, currentSection:', currentSection, 'isSubmittingForm:', isSubmittingForm)}
            >
              {(isSubmitting || isSubmittingForm) && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>Submit Application</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNextSection}
              className="flex items-center space-x-2"
            >
              <span>Next →</span>
            </Button>
          )}
        </div>
      </div>

      {/* Section Pagination */}
      <div className="flex justify-center items-center space-x-2 py-4">
        {sections.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSection(index)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
              index === currentSection
                ? 'bg-blue-600 text-white shadow-md'
                : index < currentSection
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={sections[index].title}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Reset button */}
      <div className="text-center pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset()
            setCurrentSection(0)
            toast({
              title: "Form Reset",
              description: "All fields have been cleared.",
            })
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          Reset Form
        </Button>
      </div>
    </form>
  )
}