// Type definitions for NGO Student Sponsorship System
// Schema matches Google Sheets Apps Script backend (47 fields)

export interface Student {
  // Row identifier
  id: number
  
  // Timestamp (Column A - Index 0)
  timestamp: string
  
  // Student Name Fields (Columns B-E - Index 1-4)
  studentName: string      // Column B - Index 1 (Full name)
  firstName: string        // Column C - Index 2
  middleName: string       // Column D - Index 3
  lastName: string         // Column E - Index 4
  
  // Gender (Column F - Index 5)
  gender: string          // Column F - Index 5 (male/female/other)
  
  // Photo (Column G - Index 6)
  photo?: string          // Column G - Index 6 (base64 or URL)
  
  // Basic Info (Columns H-K - Index 7-10)
  age: number             // Column H - Index 7
  dateOfBirth: string     // Column I - Index 8
  aadharNumber: string    // Column J - Index 9
  village: string         // Column K - Index 10 (villageName in form)
  disability: string      // Column L - Index 11
  
  // Education Info (Columns M-Q - Index 12-16)
  currentEducation: string   // Column M - Index 12
  currentYear: string        // Column N - Index 13
  schoolName: string         // Column O - Index 14
  otherEducation?: string    // Column P - Index 15
  futurePlans: string        // Column Q - Index 16
  
  // Academic Performance (Columns R-W - Index 17-22)
  year1Class?: string        // Column R - Index 17
  year1Marks?: string        // Column S - Index 18
  year2Class?: string        // Column T - Index 19
  year2Marks?: string        // Column U - Index 20
  year3Class?: string        // Column V - Index 21
  year3Marks?: string        // Column W - Index 22
  
  // Achievements (Column X - Index 23)
  achievements?: string      // Column X - Index 23
  
  // Financial Info - Expenses (Columns Y-AG - Index 24-32)
  tuitionFees: number        // Column Y - Index 24
  booksCost: number          // Column Z - Index 25
  stationeryCost: number     // Column AA - Index 26
  travelCost: number         // Column AB - Index 27
  uniformCost: number        // Column AC - Index 28
  examFees: number           // Column AD - Index 29
  hostelFees: number         // Column AE - Index 30
  otherExpenses: number      // Column AF - Index 31
  totalExpenses: number      // Column AG - Index 32
  
  // Family Info (Columns AH-AP - Index 33-41)
  fatherName: string         // Column AH - Index 33
  motherName: string         // Column AI - Index 34
  fatherAge: string          // Column AJ - Index 35
  fatherOccupation: string   // Column AK - Index 36
  fatherIncome: number       // Column AL - Index 37
  familyYearlyIncome: number // Column AM - Index 38
  totalFamilyMembers: number // Column AN - Index 39
  earningMembers: number     // Column AO - Index 40
  educationExpenseBearer: string // Column AP - Index 41
  
  // Contact Info (Columns AQ-AU - Index 42-46)
  phoneNumber: string        // Column AQ - Index 42
  alternatePhone?: string    // Column AR - Index 43
  email?: string             // Column AS - Index 44
  address: string            // Column AT - Index 45
  pincode: string            // Column AU - Index 46
  
  // Application Status (Column AV - Index 47)
  status: 'pending' | 'approved' | 'rejected'  // Column AV - Index 47
}

// Analytics data structure
export interface AnalyticsData {
  stats: {
    totalStudents: number
    averageAge: number
    medianIncome: number
    averageExpenses: number
    totalExpenses: number
    studentsNeedingHelp: number
  }
  ageDistribution: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  villageDistribution: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  incomeSourceDistribution: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  expenseBreakdown: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  performanceTrends: {
    labels: string[]
    data: number[]
    colors: string[]
  }
}

// Sync status
export interface SyncStatus {
  state: 'loading' | 'connected' | 'error' | 'offline'
  message: string
  lastSync?: string
  autoSync?: boolean
}

// Form submission data (matches Google Sheets Apps Script)
export interface FormSubmissionData {
  timestamp?: string
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
  totalExpenses?: number
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
