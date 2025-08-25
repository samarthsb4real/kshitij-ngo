import { Student } from './pdf-utils'

// Parse CSV data and convert to Student objects
export const parseCSVToStudents = (csvData: string): Student[] => {
  const lines = csvData.trim().split('\n')
  const headers = lines[0].split(',')
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',')
    
    // Extract relevant fields from CSV
    const name = values[3] || `Student ${index + 1}`
    const age = parseInt(values[4]) || 18
    const classLevel = values[5] || 'Unknown'
    const village = values[6] || 'Unknown'
    const school = values[7] || 'Unknown'
    const fatherName = values[14] ? values[14].split(',')[0] : 'Unknown'
    const phone = values[24] || 'Not provided'
    const address = values[25] || 'Not provided'
    
    // Calculate expenses from CSV columns
    const travel = parseInt(values[16]) || 0
    const fees = parseInt(values[17]) || 0
    const books = parseInt(values[18]) || 0
    const stationery = parseInt(values[19]) || 0
    const uniform = parseInt(values[20]) || 0
    const tuition = parseInt(values[21]) || 0
    const totalExpenses = travel + fees + books + stationery + uniform + tuition
    
    const familyIncome = parseInt(values[19]) || 0
    
    // Assign random status for demo
    const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
      id: `student-${index + 1}`,
      name,
      age,
      class: classLevel,
      village,
      school,
      fatherName,
      phone,
      address,
      status,
      totalExpenses,
      familyIncome,
      submissionDate: values[2] || new Date().toISOString()
    }
  })
}

// Mock data for development
export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'AKSHDA PRAKASH TAKWALE',
    age: 19,
    class: '1st year',
    village: 'Kondhur',
    school: 'Abhinav College nare ambega',
    currentEducation: 'MSc IT',
    academicPerformance: {
      year1: '2022, 10th, 69.60%',
      year2: '2023, 11th, 49%',
      year3: '2024, 12th, 42%'
    },
    achievements: 'District level third rank',
    futurePlans: 'Police Officer',
    disability: 'None',
    fatherName: 'Prakash Takwale',
    motherName: 'Vaishali Takwale',
    parentAge: '40 & 35',
    parentEducation: 'Standard 10',
    totalFamilyMembers: 6,
    earningMembers: 1,
    phone: '9022704532',
    address: 'Kondhur digewadi taluka mushi Jilla Pune',
    status: 'approved',
    expenses: {
      travel: 1000,
      fees: 15000,
      books: 2000,
      stationery: 3000,
      uniform: 1500,
      tuition: 10000,
      other: 0
    },
    totalExpenses: 32500,
    familyIncome: 35000,
    incomeSource: 'Farming',
    expenseBearer: 'Parents',
    needsHelp: 'Yes',
    submissionDate: '2025-02-07'
  },
  {
    id: '2',
    name: 'Vaishnavi Prakash Takwale',
    age: 18,
    class: '1st year',
    village: 'Kondhur',
    school: 'Abhinav College mere ambegaon',
    currentEducation: 'Tally',
    academicPerformance: {
      year1: 'Year 2022 standard 10 marks 72',
      year2: 'Year 2023 standard 11 marks 47',
      year3: 'Year 2024 standard 12 marks 49.50%'
    },
    achievements: '',
    futurePlans: 'Bank manager',
    disability: 'नाही',
    fatherName: 'Prakash takwale',
    motherName: 'Vaishali takwale',
    parentAge: 'Year 40 and 35',
    parentEducation: 'Standard 10 pass',
    totalFamilyMembers: 6,
    earningMembers: 1,
    phone: '9022704532',
    address: 'Kondhur digewadi taluka mushi Jilla Pune',
    status: 'pending',
    expenses: {
      travel: 1000,
      fees: 20000,
      books: 2000,
      stationery: 1500,
      uniform: 1000,
      tuition: 10000,
      other: 0
    },
    totalExpenses: 35500,
    familyIncome: 35000,
    incomeSource: 'Fram',
    expenseBearer: 'पालक',
    needsHelp: 'Ho',
    submissionDate: '2025-02-07'
  },
  {
    id: '3',
    name: 'Komal prakash salunke',
    age: 16,
    class: '11th',
    village: 'Wanjale',
    school: 'MES.Aabasaheb garware college',
    currentEducation: '11th science',
    academicPerformance: {
      year1: '2023',
      year2: '2024',
      year3: '2025'
    },
    achievements: 'Pass',
    futurePlans: 'Doctor',
    disability: 'नाही',
    fatherName: 'Prakash',
    motherName: '',
    parentAge: '45',
    parentEducation: '2th',
    totalFamilyMembers: 6,
    earningMembers: 1,
    phone: '7391858935',
    address: 'Wanjale, Pune',
    status: 'rejected',
    expenses: {
      travel: 6000,
      fees: 5925,
      books: 2000,
      stationery: 1000,
      uniform: 0,
      tuition: 0,
      other: 1000
    },
    totalExpenses: 15925,
    familyIncome: 61000,
    incomeSource: 'Sheti',
    expenseBearer: 'पालक',
    needsHelp: '',
    submissionDate: '2025-02-07'
  }
]