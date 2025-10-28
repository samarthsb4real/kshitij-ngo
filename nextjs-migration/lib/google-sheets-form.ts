// Google Sheets integration for form submissions

export interface FormSubmissionData {
  studentName: string
  firstName: string
  middleName?: string
  lastName: string
  photo?: string
  age: number
  dateOfBirth: string
  villageName: string
  disability?: string
  currentEducation: string
  currentYear: string
  schoolName: string
  otherEducation?: string
  futurePlans: string
  aadharNumber?: string
  gender?: string
  alternatePhone?: string
  email?: string
  year1Class?: string
  year1Marks?: string
  year2Class?: string
  year2Marks?: string
  year3Class?: string
  year3Marks?: string
  achievements?: string
  tuitionFees: number
  booksCost: number
  stationeryCost: number
  travelCost: number
  uniformCost?: number
  examFees?: number
  hostelFees?: number
  otherExpenses?: number
  fatherName: string
  motherName: string
  fatherAge: number
  fatherOccupation: string
  fatherIncome: number
  familyYearlyIncome: number
  totalFamilyMembers: number
  earningMembers: number
  educationExpenseBearer: string
  phoneNumber: string
  address: string
  pincode: string
}

// Submit form data to Google Sheets via Apps Script Web App
export type GoogleSheetsResult = {
  success: boolean
  status?: number
  error?: string
}

export const submitToGoogleSheets = async (formData: FormSubmissionData): Promise<GoogleSheetsResult> => {
  try {
    const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    
    if (!GOOGLE_SCRIPT_URL) {
      console.warn('Google Sheets URL not configured. Saving locally only.')
      return { success: false, error: 'Google script URL not configured' }
    }

    // Validate URL format
    if (!GOOGLE_SCRIPT_URL.startsWith('https://script.google.com/')) {
      console.error('Invalid Google Script URL format')
      return { success: false, error: 'Invalid Google script URL format' }
    }

    const totalExpenses = 
      (formData.tuitionFees || 0) +
      (formData.booksCost || 0) +
      (formData.stationeryCost || 0) +
      (formData.travelCost || 0) +
      (formData.uniformCost || 0) +
      (formData.examFees || 0) +
      (formData.hostelFees || 0) +
      (formData.otherExpenses || 0)

    const payload = {
      timestamp: new Date().toISOString(),
      studentName: formData.studentName,
      firstName: formData.firstName,
      middleName: formData.middleName || '',
      lastName: formData.lastName,
      photo: formData.photo || '',
      age: formData.age,
      dateOfBirth: formData.dateOfBirth,
      villageName: formData.villageName,
  aadharNumber: formData.aadharNumber || '',
  gender: formData.gender || '',
      disability: formData.disability || 'None',
      currentEducation: formData.currentEducation,
      currentYear: formData.currentYear,
      schoolName: formData.schoolName,
      otherEducation: formData.otherEducation || '',
      futurePlans: formData.futurePlans,
      year1Class: formData.year1Class || '',
      year1Marks: formData.year1Marks || '',
      year2Class: formData.year2Class || '',
      year2Marks: formData.year2Marks || '',
      year3Class: formData.year3Class || '',
      year3Marks: formData.year3Marks || '',
      achievements: formData.achievements || '',
      tuitionFees: formData.tuitionFees || 0,
      booksCost: formData.booksCost || 0,
      stationeryCost: formData.stationeryCost || 0,
      travelCost: formData.travelCost || 0,
      uniformCost: formData.uniformCost || 0,
      examFees: formData.examFees || 0,
      hostelFees: formData.hostelFees || 0,
      otherExpenses: formData.otherExpenses || 0,
      totalExpenses: totalExpenses,
  // Contact extras
  alternatePhone: formData.alternatePhone || '',
  email: formData.email || '',
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      fatherAge: formData.fatherAge,
      fatherOccupation: formData.fatherOccupation,
      fatherIncome: formData.fatherIncome,
      familyYearlyIncome: formData.familyYearlyIncome,
      totalFamilyMembers: formData.totalFamilyMembers,
      earningMembers: formData.earningMembers,
      educationExpenseBearer: formData.educationExpenseBearer,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      pincode: formData.pincode
    }

    // Retry logic with exponential backoff
    const maxRetries = 2
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add timeout and proper error handling
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
          // @ts-ignore - These options are for Node.js fetch (undici)
          keepalive: true,
          // @ts-ignore
          connectTimeout: 20000, // 20 second connection timeout
          // @ts-ignore
          bodyTimeout: 30000, // 30 second body timeout
        })
        
        clearTimeout(timeoutId)
        // Check response status
        const text = await response.text().catch(() => '')
        if (!response.ok) {
          const msg = `Google script returned ${response.status} ${response.statusText} - ${text}`
          console.error(msg)
          return { success: false, status: response.status, error: msg }
        }

        console.log(`Google Sheets submission successful on attempt ${attempt + 1}`)
        return { success: true }
      } catch (fetchError) {
        lastError = fetchError as Error
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error(`Google Sheets request timed out on attempt ${attempt + 1}`)
        } else {
          console.error(`Google Sheets request failed on attempt ${attempt + 1}:`, fetchError)
        }
        
        // If not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000) // Exponential backoff, max 5s
          console.log(`Retrying in ${delayMs}ms...`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
      }
    }

    console.error('All retry attempts failed:', lastError)
    return { success: false, error: lastError?.message || 'Unknown error' }
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
