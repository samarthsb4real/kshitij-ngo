// Form utility functions

export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
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

export const validateSectionFields = async (
  fields: string[], 
  data: any, 
  trigger: (name?: any) => Promise<boolean>
): Promise<boolean> => {
  try {
    // Validate all fields in the section
    const validationResults = await Promise.all(
      fields.map(field => trigger(field))
    )
    
    // Check if all fields are filled and valid
    const allFieldsValid = fields.every(field => {
      const value = data[field]
      if (typeof value === 'number') {
        return value !== undefined && !isNaN(value) && value >= 0
      }
      return value !== undefined && value !== ''
    })
    
    return validationResults.every(Boolean) && allFieldsValid
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
}

export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Please upload only JPEG, PNG, or WebP images"
    }
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return {
      isValid: false,
      error: "Please upload an image smaller than 5MB"
    }
  }
  
  return { isValid: true }
}

export const villages = [
  'Kondhur', 'Wanjale', 'Shivapur', 'Karjat', 'Mulshi', 'Tamhini', 
  'Paud', 'Sus', 'Bavdhan', 'Warje'
]

export const educationStreams = [
  { value: '10th', label: '10th Grade' },
  { value: '11th-science', label: '11th Science' },
  { value: '11th-commerce', label: '11th Commerce' },
  { value: '11th-arts', label: '11th Arts' },
  { value: '12th-science', label: '12th Science' },
  { value: '12th-commerce', label: '12th Commerce' },
  { value: '12th-arts', label: '12th Arts' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'ba', label: 'Bachelor of Arts (B.A.)' },
  { value: 'bsc', label: 'Bachelor of Science (B.Sc.)' },
  { value: 'bcom', label: 'Bachelor of Commerce (B.Com.)' },
  { value: 'bba', label: 'Bachelor of Business Administration (B.B.A.)' },
  { value: 'btech', label: 'Bachelor of Technology (B.Tech.)' },
  { value: 'ma', label: 'Master of Arts (M.A.)' },
  { value: 'msc', label: 'Master of Science (M.Sc.)' },
  { value: 'mcom', label: 'Master of Commerce (M.Com.)' },
  { value: 'mba', label: 'Master of Business Administration (M.B.A.)' },
  { value: 'other', label: 'Other (Please Specify)' }
]

export const getSectionRequiredFields = (sectionIndex: number, currentEducation?: string) => {
  const baseRequiredFields = {
    0: ['firstName', 'lastName', 'gender', 'photo', 'dateOfBirth', 'age', 'villageName', 'disability'], // Personal Info
    1: ['currentEducation', 'schoolName', 'futurePlans'], // Education - conditionally add otherEducation
    2: ['year1Class', 'year1Marks', 'year2Class', 'year2Marks', 'year3Class', 'year3Marks'], // Academic - all 3 years mandatory
    3: ['tuitionFees', 'booksCost', 'stationeryCost', 'travelCost'], // Expenses - first 4 mandatory
    4: ['fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer'], // Family - all mandatory
    5: ['phoneNumber', 'address'] // Contact Info - phone and address mandatory
  }
  
  let requiredForSection = baseRequiredFields[sectionIndex as keyof typeof baseRequiredFields] || []
  
  // Add otherEducation if we're on education section and currentEducation is "other"
  if (sectionIndex === 1 && currentEducation === 'other') {
    requiredForSection = [...requiredForSection, 'otherEducation']
  }
  
  return requiredForSection
}

export const getProgressRequiredFields = (currentEducation?: string) => {
  const baseFields = [
    // Personal Info
    'firstName', 'lastName', 'gender', 'photo', 'dateOfBirth', 'age', 'villageName', 'disability',
    // Education Info  
    'currentEducation', 'schoolName', 'futurePlans',
    // Academic Performance
    'year1Class', 'year1Marks', 'year2Class', 'year2Marks', 'year3Class', 'year3Marks',
    // Expenses
    'tuitionFees', 'booksCost', 'stationeryCost', 'travelCost',
    // Family Info
    'fatherName', 'motherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers', 'educationExpenseBearer',
    // Contact Info
    'phoneNumber', 'address'
  ]
  
  // Add otherEducation if currentEducation is "other"
  if (currentEducation === 'other') {
    baseFields.push('otherEducation')
  }
  
  return baseFields
}

export const generateRecentYears = (currentEducation: string): string[] => {
  const educationToYears: { [key: string]: string[] } = {
    '10th': ['8th', '9th', '10th'],
    '11th-science': ['9th', '10th', '11th Science'],
    '11th-commerce': ['9th', '10th', '11th Commerce'],
    '11th-arts': ['9th', '10th', '11th Arts'],
    '12th-science': ['10th', '11th Science', '12th Science'],
    '12th-commerce': ['10th', '11th Commerce', '12th Commerce'],
    '12th-arts': ['10th', '11th Arts', '12th Arts'],
    'diploma': ['10th', '12th', 'Diploma Year 1'],
    'ba': ['12th', 'B.A. Year 1', 'B.A. Year 2'],
    'bsc': ['12th', 'B.Sc. Year 1', 'B.Sc. Year 2'],
    'bcom': ['12th', 'B.Com. Year 1', 'B.Com. Year 2'],
    'bba': ['12th', 'B.B.A. Year 1', 'B.B.A. Year 2'],
    'btech': ['12th', 'B.Tech Year 1', 'B.Tech Year 2'],
    'ma': ['B.A. Year 3', 'M.A. Year 1', 'M.A. Year 2'],
    'msc': ['B.Sc. Year 3', 'M.Sc. Year 1', 'M.Sc. Year 2'],
    'mcom': ['B.Com. Year 3', 'M.Com. Year 1', 'M.Com. Year 2'],
    'mba': ['Bachelor Degree', 'M.B.A. Year 1', 'M.B.A. Year 2']
  }
  
  return educationToYears[currentEducation] || ['', '', '']
}