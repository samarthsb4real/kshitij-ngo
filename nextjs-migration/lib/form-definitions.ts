// Complete Form Field Definition - Matches Google Apps Script exactly
// This ensures 100% consistency between frontend form and backend storage

export interface FormFieldDefinitions {
  // Personal Information (Columns A-L)
  timestamp: string              // Column A (0) - Auto-generated
  studentName: string           // Column B (1) - Computed from first+middle+last
  firstName: string             // Column C (2) - Required
  middleName?: string           // Column D (3) - Optional
  lastName: string              // Column E (4) - Required
  gender: string                // Column F (5) - Required (male/female/other)
  photo: string                 // Column G (6) - Required (base64 image)
  age: number                   // Column H (7) - Computed from DOB
  dateOfBirth: string           // Column I (8) - Required (YYYY-MM-DD)
  aadharNumber?: string         // Column J (9) - Optional (12 digits)
  villageName: string           // Column K (10) - Required (from dropdown)
  disability?: string           // Column L (11) - Optional
  
  // Education Information (Columns M-Q)
  currentEducation: string      // Column M (12) - Required (from dropdown)
  currentYear?: string          // Column N (13) - Optional (legacy field)
  schoolName: string            // Column O (14) - Required
  otherEducation?: string       // Column P (15) - Optional (if currentEducation = "other")
  futurePlans: string           // Column Q (16) - Required
  
  // Academic Performance (Columns R-X) - All Optional
  year1Class?: string           // Column R (17) - Auto-filled based on currentEducation
  year1Marks?: number           // Column S (18) - Optional (0-100)
  year2Class?: string           // Column T (19) - Auto-filled
  year2Marks?: number           // Column U (20) - Optional (0-100)
  year3Class?: string           // Column V (21) - Auto-filled
  year3Marks?: number           // Column W (22) - Optional (0-100)
  achievements?: string         // Column X (23) - Optional
  
  // Financial Information - Expenses (Columns Y-AG) - All Required
  tuitionFees: number           // Column Y (24) - Required (min 0)
  booksCost: number             // Column Z (25) - Required (min 0)
  stationeryCost: number        // Column AA (26) - Required (min 0)
  travelCost: number            // Column AB (27) - Required (min 0)
  uniformCost: number           // Column AC (28) - Required (min 0)
  examFees: number              // Column AD (29) - Required (min 0)
  hostelFees: number            // Column AE (30) - Required (min 0)
  otherExpenses: number         // Column AF (31) - Required (min 0)
  totalExpenses: number         // Column AG (32) - Computed sum
  
  // Family Information (Columns AH-AP) - All Required
  fatherName: string            // Column AH (33) - Required
  motherName: string            // Column AI (34) - Required
  fatherAge: number             // Column AJ (35) - Required (25-100)
  fatherOccupation: string      // Column AK (36) - Required
  fatherIncome: number          // Column AL (37) - Required (min 0)
  familyYearlyIncome: number    // Column AM (38) - Required (min fatherIncome)
  totalFamilyMembers: number    // Column AN (39) - Required (min 1)
  earningMembers: number        // Column AO (40) - Required (0 to totalFamilyMembers)
  educationExpenseBearer: string // Column AP (41) - Required
  
  // Contact Information (Columns AQ-AU)
  phoneNumber: string           // Column AQ (42) - Required (10 digits, starts with 6-9)
  alternatePhone?: string       // Column AR (43) - Optional (10 digits, starts with 6-9)
  email?: string                // Column AS (44) - Optional (valid email format)
  address: string               // Column AT (45) - Required (min 10 chars)
  pincode: string               // Column AU (46) - Required (6 digits)
  
  // Application Status (Column AV)
  status: 'pending' | 'approved' | 'rejected'  // Column AV (47) - Default: 'pending'
}

// Form Section Definitions - Exactly 6 sections
export const FORM_SECTIONS = {
  PERSONAL_INFO: 0,      // firstName, middleName, lastName, gender, photo, dateOfBirth, age, aadharNumber, villageName, disability
  EDUCATION_INFO: 1,     // currentEducation, schoolName, otherEducation, futurePlans
  ACADEMIC_PERFORMANCE: 2, // year1Class, year1Marks, year2Class, year2Marks, year3Class, year3Marks, achievements
  EXPENSES: 3,           // tuitionFees, booksCost, stationeryCost, travelCost, uniformCost, examFees, hostelFees, otherExpenses
  FAMILY_INFO: 4,        // fatherName, motherName, fatherAge, fatherOccupation, fatherIncome, familyYearlyIncome, totalFamilyMembers, earningMembers, educationExpenseBearer
  CONTACT_INFO: 5        // phoneNumber, alternatePhone, email, address, pincode
} as const

// Field Groups for Validation
export const REQUIRED_FIELDS = [
  'firstName', 'lastName', 'gender', 'photo', 'dateOfBirth', 'villageName',
  'currentEducation', 'schoolName', 'futurePlans',
  'tuitionFees', 'booksCost', 'stationeryCost', 'travelCost', 'uniformCost', 'examFees', 'hostelFees', 'otherExpenses',
  'fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer',
  'phoneNumber', 'address', 'pincode'
] as const

export const OPTIONAL_FIELDS = [
  'middleName', 'aadharNumber', 'disability', 'currentYear', 'otherEducation',
  'year1Class', 'year1Marks', 'year2Class', 'year2Marks', 'year3Class', 'year3Marks', 'achievements',
  'alternatePhone', 'email'
] as const

export const COMPUTED_FIELDS = [
  'timestamp', 'studentName', 'age', 'totalExpenses', 'status'
] as const