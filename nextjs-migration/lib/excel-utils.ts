// Excel/CSV export utilities for form submissions

export interface FormSubmission {
  id: string
  timestamp: string
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

// Store form submissions in localStorage
export const saveFormSubmission = (formData: Omit<FormSubmission, 'id' | 'timestamp'>) => {
  const submission: FormSubmission = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...formData
  }
  
  const existingSubmissions = getStoredSubmissions()
  const updatedSubmissions = [...existingSubmissions, submission]
  
  localStorage.setItem('ngo_form_submissions', JSON.stringify(updatedSubmissions))
  return submission.id
}

// Get all stored submissions
export const getStoredSubmissions = (): FormSubmission[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('ngo_form_submissions')
  return stored ? JSON.parse(stored) : []
}

// Get submissions for a specific date
export const getSubmissionsByDate = (date: string): FormSubmission[] => {
  const submissions = getStoredSubmissions()
  return submissions.filter(submission => 
    submission.timestamp.startsWith(date)
  )
}

// Export submissions to CSV/Excel format
export const exportSubmissionsToExcel = (submissions: FormSubmission[], filename?: string) => {
  if (submissions.length === 0) {
    alert('No submissions to export')
    return
  }

  // CSV headers
  const headers = [
    'ID', 'Submission Date', 'Student Name', 'Age', 'Class', 'Village', 'School',
    'Current Education', 'Father Name', 'Mother Name', 'Parent Ages', 'Parent Education',
    'Family Members', 'Earning Members', 'Annual Income', 'Income Source', 'Phone',
    'Address', 'Future Plans', 'Needs Help', 'Travel Expenses', 'School Fees',
    'Books', 'Stationery', 'Uniform', 'Tuition', 'Other Expenses', 'Total Expenses'
  ]

  // Convert submissions to CSV rows
  const csvRows = submissions.map(submission => [
    submission.id,
    new Date(submission.timestamp).toLocaleDateString('en-IN'),
    submission.studentName,
    submission.age,
    submission.class,
    submission.village,
    submission.school,
    submission.currentEducation,
    submission.fatherName,
    submission.motherName,
    submission.parentAge,
    submission.parentEducation,
    submission.familyMembers,
    submission.earningMembers,
    submission.annualIncome,
    submission.incomeSource,
    submission.phone,
    submission.address,
    submission.futurePlans,
    submission.needsHelp,
    submission.expenses.travel,
    submission.expenses.fees,
    submission.expenses.books,
    submission.expenses.stationery,
    submission.expenses.uniform,
    submission.expenses.tuition,
    submission.expenses.other,
    submission.totalExpenses
  ])

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `Kshitij_NGO_Submissions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Export today's submissions
export const exportTodaysSubmissions = () => {
  const today = new Date().toISOString().split('T')[0]
  const todaysSubmissions = getSubmissionsByDate(today)
  exportSubmissionsToExcel(todaysSubmissions, `Kshitij_NGO_Submissions_${today}.csv`)
}

// Export all submissions
export const exportAllSubmissions = () => {
  const allSubmissions = getStoredSubmissions()
  exportSubmissionsToExcel(allSubmissions, `Kshitij_NGO_All_Submissions_${new Date().toISOString().split('T')[0]}.csv`)
}

// Clear all stored submissions
export const clearAllSubmissions = () => {
  if (confirm('Are you sure you want to clear all stored form submissions?')) {
    localStorage.removeItem('ngo_form_submissions')
    return true
  }
  return false
}