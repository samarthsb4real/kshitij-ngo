import * as z from 'zod'

export const formSchema = z.object({
  // Personal Information - Core fields are required
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces')
    .transform(s => s.trim()),
  middleName: z.string()
    .max(50, 'Middle name is too long')
    .regex(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces')
    .transform(s => s.trim())
    .optional(),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces')
    .transform(s => s.trim()),
  gender: z.string()
    .min(1, 'Gender is required'),
  photo: z.string()
    .min(1, 'Student photo is required for identification')
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
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0)
      return age >= 9 && age <= 21
    }, 'Student must be between 9-21 years old for sponsorship eligibility'),
  aadharNumber: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      return /^[0-9]{12}$/.test(val.replace(/\s/g, ''))
    }, 'Aadhar number must be exactly 12 digits'),
  age: z.number()
    .int('Age must be a whole number')
    .min(9, 'Student must be at least 9 years old')
    .max(21, 'Student must be 21 years or younger for sponsorship eligibility'),
  villageName: z.string()
    .min(1, 'Village/City is required for verification')
    .max(100, 'Village name is too long'),
  disability: z.string()
    .min(1, 'Please specify disability status (write "None" if no disability)'),
  
  // Education Information - All fields mandatory
  currentEducation: z.string()
    .min(1, 'Current education level is required'),
  schoolName: z.string()
    .min(3, 'Institution name is required (minimum 3 characters)')
    .max(200, 'Institution name is too long')
    .transform(s => s.trim()),
  otherEducation: z.string()
    .max(500, 'Description is too long')
    .transform(s => s.trim())
    .optional(),
  futurePlans: z.string()
    .min(20, 'Please describe your future plans (minimum 20 characters)')
    .max(1000, 'Description is too long')
    .transform(s => s.trim()),
  
  // Academic Performance - All 3 years mandatory
  year1Class: z.string()
    .min(1, 'Year 1 class/grade is required')
    .max(50, 'Class name is too long'),
  year1Marks: z.number()
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100%'),
  year2Class: z.string()
    .min(1, 'Year 2 class/grade is required')
    .max(50, 'Class name is too long'),
  year2Marks: z.number()
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100%'),
  year3Class: z.string()
    .min(1, 'Year 3 class/grade is required')
    .max(50, 'Class name is too long'),
  year3Marks: z.number()
    .min(0, 'Marks cannot be negative')
    .max(100, 'Marks cannot exceed 100%'),
  achievements: z.string().max(1000, 'Description is too long').optional(),
  
  // Expenses - Essential for scholarship calculation
  tuitionFees: z.number()
    .min(0, 'Tuition fees cannot be negative')
    .max(500000, 'Tuition fees seem unrealistic')
    .finite('Must be a valid number'),
  booksCost: z.number()
    .min(0, 'Books cost cannot be negative')
    .max(50000, 'Books cost seems too high')
    .finite('Must be a valid number'),
  stationeryCost: z.number()
    .min(0, 'Stationery cost cannot be negative')
    .max(25000, 'Stationery cost seems too high')
    .finite('Must be a valid number'),
  travelCost: z.number()
    .min(0, 'Travel cost cannot be negative')
    .max(100000, 'Travel cost seems too high')
    .finite('Must be a valid number'),
  uniformCost: z.number()
    .min(0, 'Uniform cost cannot be negative')
    .max(25000, 'Uniform cost seems too high')
    .finite('Must be a valid number')
    .default(0),
  examFees: z.number()
    .min(0, 'Exam fees cannot be negative')
    .max(50000, 'Exam fees seem too high')
    .finite('Must be a valid number')
    .default(0),
  hostelFees: z.number()
    .min(0, 'Hostel fees cannot be negative')
    .max(300000, 'Hostel fees seem too high')
    .finite('Must be a valid number')
    .default(0),
  otherExpenses: z.number()
    .min(0, 'Other expenses cannot be negative')
    .max(50000, 'Other expenses seem too high')
    .finite('Must be a valid number')
    .default(0),
  
  // Family Information - Essential for financial assessment
  fatherName: z.string()
    .min(2, 'Father\'s name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces')
    .transform(s => s.trim()),
  motherName: z.string()
    .min(2, 'Mother\'s name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces')
    .transform(s => s.trim()),
  fatherAge: z.number()
    .int('Age must be a whole number')
    .min(20, 'Father\'s age must be at least 20')
    .max(80, 'Please enter a valid age'),
  fatherOccupation: z.string()
    .min(2, 'Father\'s occupation is required')
    .max(100, 'Occupation description is too long')
    .transform(s => s.trim()),
  fatherIncome: z.number()
    .min(0, 'Income cannot be negative')
    .max(5000000, 'Income seems too high for scholarship eligibility')
    .finite('Must be a valid number'),
  familyYearlyIncome: z.number()
    .min(0, 'Family income cannot be negative')
    .max(5000000, 'Income seems too high for scholarship eligibility')
    .finite('Must be a valid number'),
  totalFamilyMembers: z.number()
    .int('Must be a whole number')
    .min(2, 'At least 2 family members required')
    .max(20, 'Please enter a realistic number'),
  earningMembers: z.number()
    .int('Must be a whole number')
    .min(1, 'At least 1 earning member required')
    .max(10, 'Please enter a realistic number'),
  educationExpenseBearer: z.string()
    .min(2, 'Please specify who bears education expenses')
    .max(100, 'Description is too long')
    .transform(s => s.trim()),
  
  // Contact Information - Essential for communication
  phoneNumber: z.string()
    .regex(/^[6-9][0-9]{9}$/, 'Enter valid 10-digit Indian mobile number')
    .length(10, 'Phone number must be exactly 10 digits'),
  alternatePhone: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      return /^[6-9][0-9]{9}$/.test(val) && val.length === 10
    }, 'Enter valid 10-digit Indian mobile number'),
  email: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    }, 'Enter valid email address'),
  address: z.string()
    .min(10, 'Complete address is required (minimum 10 characters)')
    .max(500, 'Address is too long')
    .transform(s => s.trim()),
  pincode: z.string()
    .regex(/^[1-9][0-9]{5}$/, 'Enter valid 6-digit pincode')
    .length(6, 'Pincode must be exactly 6 digits')
}).refine((data) => {
  return data.earningMembers <= data.totalFamilyMembers
}, {
  message: 'Earning members cannot exceed total family members',
  path: ['earningMembers'],
}).refine((data) => {
  return data.fatherIncome <= data.familyYearlyIncome
}, {
  message: 'Father\'s income cannot exceed total family income',
  path: ['fatherIncome'],
}).refine((data) => {
  // If currentEducation is "other", then otherEducation is required
  if (data.currentEducation === 'other') {
    return data.otherEducation && data.otherEducation.trim().length >= 3
  }
  return true
}, {
  message: 'Please specify your education level when selecting "Other"',
  path: ['otherEducation'],
}).refine((data) => {
  // Total expenses should be reasonable compared to family income
  const totalExpenses = (data.tuitionFees || 0) + (data.booksCost || 0) + 
    (data.stationeryCost || 0) + (data.travelCost || 0) + 
    (data.uniformCost || 0) + (data.examFees || 0) + 
    (data.hostelFees || 0) + (data.otherExpenses || 0)
  
  return totalExpenses <= data.familyYearlyIncome * 0.8 // 80% of family income
}, {
  message: 'Total education expenses cannot exceed 80% of family yearly income',
  path: ['tuitionFees'],
}).refine((data) => {
  // Validate age matches date of birth
  if (data.dateOfBirth) {
    const birthDate = new Date(data.dateOfBirth)
    const today = new Date()
    const calculatedAge = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0)
    
    return Math.abs(calculatedAge - data.age) <= 1 // Allow 1 year difference
  }
  return true
}, {
  message: 'Age does not match the date of birth provided',
  path: ['age'],
})

export type FormData = z.infer<typeof formSchema>