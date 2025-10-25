// Type definitions for NGO Student Sponsorship System
// Schema matches Google Sheets Apps Script backend (43 fields)

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
  
  // Photo (Column F - Index 5)
  photo?: string          // Column F - Index 5 (base64 or URL)
  
  // Basic Info (Columns G-J - Index 6-9)
  age: number             // Column G - Index 6
  dateOfBirth: string     // Column H - Index 7
  village: string         // Column I - Index 8 (villageName in form)
  disability: string      // Column J - Index 9
  
  // Education Info (Columns K-O - Index 10-14)
  currentEducation: string   // Column K - Index 10
  currentYear: string        // Column L - Index 11
  schoolName: string         // Column M - Index 12
  otherEducation?: string    // Column N - Index 13
  futurePlans: string        // Column O - Index 14
  
  // Academic Performance (Columns P-U - Index 15-20)
  year1Class?: string        // Column P - Index 15
  year1Marks?: string        // Column Q - Index 16
  year2Class?: string        // Column R - Index 17
  year2Marks?: string        // Column S - Index 18
  year3Class?: string        // Column T - Index 19
  year3Marks?: string        // Column U - Index 20
  
  // Achievements (Column V - Index 21)
  achievements?: string      // Column V - Index 21
  
  // Financial Info - Expenses (Columns W-AE - Index 22-30)
  tuitionFees: number        // Column W - Index 22
  booksCost: number          // Column X - Index 23
  stationeryCost: number     // Column Y - Index 24
  travelCost: number         // Column Z - Index 25
  uniformCost: number        // Column AA - Index 26
  examFees: number           // Column AB - Index 27
  hostelFees: number         // Column AC - Index 28
  otherExpenses: number      // Column AD - Index 29
  totalExpenses: number      // Column AE - Index 30
  
  // Family Info (Columns AF-AN - Index 31-39)
  fatherName: string         // Column AF - Index 31
  motherName: string         // Column AG - Index 32
  fatherAge: string          // Column AH - Index 33
  fatherOccupation: string   // Column AI - Index 34
  fatherIncome: number       // Column AJ - Index 35
  familyYearlyIncome: number // Column AK - Index 36
  totalFamilyMembers: number // Column AL - Index 37
  earningMembers: number     // Column AM - Index 38
  educationExpenseBearer: string // Column AN - Index 39
  
  // Contact Info (Columns AO-AQ - Index 40-42)
  phoneNumber: string        // Column AO - Index 40
  address: string            // Column AP - Index 41
  pincode: string            // Column AQ - Index 42
  
  // Application Status (Column AR - Index 43)
  status: 'pending' | 'approved' | 'rejected'  // Column AR - Index 43
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
