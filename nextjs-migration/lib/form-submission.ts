// Simple form submission handler
export interface FormSubmissionData {
  studentName: string
  age: number
  class: string
  village: string
  school: string
  currentEducation: string
  fatherName: string
  motherName: string
  parentAge: string
  parentEducation: string
  familyMembers: number
  earningMembers: number
  annualIncome: number
  incomeSource: string
  phone: string
  address: string
  futurePlans: string
  needsHelp: string
  expenses: {
    travel: number
    fees: number
    books: number
    stationery: number
    uniform: number
    tuition: number
    other: number
  }
  totalExpenses: number
}

export const saveFormSubmission = async (data: FormSubmissionData): Promise<void> => {
  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Form submission failed')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    throw error
  }
}