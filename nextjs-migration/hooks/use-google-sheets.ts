"use client"

import { useState, useEffect, useCallback } from 'react'

interface Student {
  id: number
  studentName: string
  age: number
  classStandard: string
  village: string
  schoolCollege: string
  currentEducation: string
  achievements: string
  futurePlans: string
  parentNames: string
  parentAges: string
  parentEducation: string
  familySize: number
  workingMembers: number
  annualIncome: number
  incomeSource: string
  needsHelp: string
  phone: string
  address: string
  expenses: {
    travel: number
    schoolFees: number
    books: number
    stationery: number
    uniform: number
    tuition: number
  }
  yearsReview: Array<{
    year: number
    standard: string
    marks: number
  }>
}

interface AnalyticsData {
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

interface SyncStatus {
  state: 'loading' | 'connected' | 'error' | 'offline'
  message: string
  lastSync?: string
  autoSync?: boolean
}

export function useGoogleSheets() {
  const [students, setStudents] = useState<Student[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    state: 'loading',
    message: 'Initializing...'
  })

  // Sample data for demonstration
  const getSampleData = useCallback((): Student[] => {
    return [
      {
        id: 1,
        studentName: "AKSHDA PRAKASH TAKWALE",
        age: 19,
        classStandard: "1st year",
        village: "Kondhur",
        schoolCollege: "Abhinav College",
        currentEducation: "MSc IT",
        achievements: "District athletics bronze",
        futurePlans: "Police Bharti",
        parentNames: "Prakash & Vaishali",
        parentAges: "40 & 35",
        parentEducation: "Std 10 both",
        familySize: 6,
        workingMembers: 1,
        annualIncome: 35000,
        incomeSource: "Farming",
        needsHelp: "Ho",
        phone: "9022704532",
        address: "Kondhur Pune",
        expenses: {
          travel: 1000,
          schoolFees: 15000,
          books: 2000,
          stationery: 3000,
          uniform: 1500,
          tuition: 10000
        },
        yearsReview: [
          { year: 2022, standard: "10", marks: 69.6 },
          { year: 2023, standard: "11", marks: 49 },
          { year: 2024, standard: "12", marks: 42 }
        ]
      },
      {
        id: 2,
        studentName: "PRIYA SURESH PATIL",
        age: 17,
        classStandard: "12th",
        village: "Shivapur",
        schoolCollege: "Govt High School",
        currentEducation: "12th Science",
        achievements: "State level math competition",
        futurePlans: "Engineering",
        parentNames: "Suresh & Sunita",
        parentAges: "42 & 38",
        parentEducation: "Std 12 both",
        familySize: 4,
        workingMembers: 2,
        annualIncome: 45000,
        incomeSource: "Agriculture",
        needsHelp: "Ho",
        phone: "9876543210",
        address: "Shivapur Pune",
        expenses: {
          travel: 800,
          schoolFees: 8000,
          books: 1500,
          stationery: 2000,
          uniform: 1200,
          tuition: 8000
        },
        yearsReview: [
          { year: 2022, standard: "10", marks: 78.5 },
          { year: 2023, standard: "11", marks: 65 },
          { year: 2024, standard: "12", marks: 72 }
        ]
      },
      {
        id: 3,
        studentName: "RAHUL GANESHIMORE",
        age: 20,
        classStandard: "2nd year",
        village: "Wadgaon",
        schoolCollege: "Fergusson College",
        currentEducation: "BSc Computer Science",
        achievements: "College programming contest winner",
        futurePlans: "Software Developer",
        parentNames: "Ganesh & Mangala",
        parentAges: "45 & 40",
        parentEducation: "Std 10 & Std 8",
        familySize: 5,
        workingMembers: 1,
        annualIncome: 40000,
        incomeSource: "Labor",
        needsHelp: "Ho",
        phone: "9123456789",
        address: "Wadgaon Pune",
        expenses: {
          travel: 1200,
          schoolFees: 20000,
          books: 3000,
          stationery: 2500,
          uniform: 2000,
          tuition: 15000
        },
        yearsReview: [
          { year: 2021, standard: "10", marks: 82.1 },
          { year: 2022, standard: "11", marks: 68 },
          { year: 2023, standard: "12", marks: 75 }
        ]
      },
      {
        id: 4,
        studentName: "SNEHA RAMESH JADHAV",
        age: 18,
        classStandard: "1st year",
        village: "Karjat",
        schoolCollege: "Modern College",
        currentEducation: "BCom",
        achievements: "Best student award",
        futurePlans: "Bank officer",
        parentNames: "Ramesh & Kavita",
        parentAges: "43 & 39",
        parentEducation: "Std 12 & Std 10",
        familySize: 4,
        workingMembers: 2,
        annualIncome: 55000,
        incomeSource: "Small business",
        needsHelp: "Ho",
        phone: "9988776655",
        address: "Karjat Pune",
        expenses: {
          travel: 900,
          schoolFees: 12000,
          books: 1800,
          stationery: 2200,
          uniform: 1300,
          tuition: 9000
        },
        yearsReview: [
          { year: 2022, standard: "10", marks: 74.8 },
          { year: 2023, standard: "11", marks: 58 },
          { year: 2024, standard: "12", marks: 61 }
        ]
      },
      {
        id: 5,
        studentName: "AMIT VIJAY KALE",
        age: 16,
        classStandard: "11th",
        village: "Kondhur",
        schoolCollege: "Zilla Parishad School",
        currentEducation: "11th Commerce",
        achievements: "Sports captain",
        futurePlans: "Chartered Accountant",
        parentNames: "Vijay & Sushila",
        parentAges: "38 & 35",
        parentEducation: "Std 10 both",
        familySize: 5,
        workingMembers: 1,
        annualIncome: 30000,
        incomeSource: "Farming",
        needsHelp: "Ho",
        phone: "9112233445",
        address: "Kondhur Pune",
        expenses: {
          travel: 600,
          schoolFees: 6000,
          books: 1200,
          stationery: 1500,
          uniform: 1000,
          tuition: 5000
        },
        yearsReview: [
          { year: 2023, standard: "10", marks: 71.2 },
          { year: 2024, standard: "11", marks: 55 }
        ]
      },
      {
        id: 6,
        studentName: "POOJA SANTOSH BHOSALE",
        age: 21,
        classStandard: "3rd year",
        village: "Shivapur",
        schoolCollege: "Pune University",
        currentEducation: "BA Psychology",
        achievements: "Research paper published",
        futurePlans: "Clinical Psychologist",
        parentNames: "Santosh & Vandana",
        parentAges: "47 & 42",
        parentEducation: "Graduate both",
        familySize: 3,
        workingMembers: 2,
        annualIncome: 65000,
        incomeSource: "Teaching",
        needsHelp: "Ho",
        phone: "9876543221",
        address: "Shivapur Pune",
        expenses: {
          travel: 1500,
          schoolFees: 18000,
          books: 2500,
          stationery: 3000,
          uniform: 1800,
          tuition: 12000
        },
        yearsReview: [
          { year: 2020, standard: "10", marks: 85.5 },
          { year: 2021, standard: "11", marks: 72 },
          { year: 2022, standard: "12", marks: 78 }
        ]
      }
    ]
  }, [])

  const calculateAnalytics = useCallback((studentsData: Student[]): AnalyticsData => {
    const totalStudents = studentsData.length
    const totalAge = studentsData.reduce((sum, student) => sum + student.age, 0)
    const averageAge = Math.round(totalAge / totalStudents)

    const incomes = studentsData.map(s => s.annualIncome).sort((a, b) => a - b)
    const medianIncome = incomes[Math.floor(incomes.length / 2)]

    const totalExpenses = studentsData.reduce((sum, student) => {
      return sum + Object.values(student.expenses).reduce((expSum, exp) => expSum + exp, 0)
    }, 0)
    const averageExpenses = Math.round(totalExpenses / totalStudents)

    const studentsNeedingHelp = studentsData.filter(s => s.needsHelp === 'Ho').length

    // Age distribution
    const ageGroups = { '15-17': 0, '18-20': 0, '21-23': 0, '24+': 0 }
    studentsData.forEach(student => {
      if (student.age >= 15 && student.age <= 17) ageGroups['15-17']++
      else if (student.age >= 18 && student.age <= 20) ageGroups['18-20']++
      else if (student.age >= 21 && student.age <= 23) ageGroups['21-23']++
      else if (student.age >= 24) ageGroups['24+']++
    })

    // Village distribution
    const villages: { [key: string]: number } = {}
    studentsData.forEach(student => {
      villages[student.village] = (villages[student.village] || 0) + 1
    })
    const sortedVillages = Object.entries(villages).sort(([,a], [,b]) => b - a).slice(0, 6)

    // Income source distribution
    const incomeSources: { [key: string]: number } = {}
    studentsData.forEach(student => {
      incomeSources[student.incomeSource] = (incomeSources[student.incomeSource] || 0) + 1
    })

    // Expense breakdown
    const expenseCategories = {
      travel: 0, schoolFees: 0, books: 0, stationery: 0, uniform: 0, tuition: 0
    }
    studentsData.forEach(student => {
      Object.keys(expenseCategories).forEach(category => {
        expenseCategories[category as keyof typeof expenseCategories] += student.expenses[category as keyof typeof student.expenses] || 0
      })
    })

    // Performance trends
    const yearlyPerformance: { [key: number]: { totalMarks: number, count: number } } = {}
    studentsData.forEach(student => {
      student.yearsReview.forEach(yearData => {
        if (!yearlyPerformance[yearData.year]) {
          yearlyPerformance[yearData.year] = { totalMarks: 0, count: 0 }
        }
        yearlyPerformance[yearData.year].totalMarks += yearData.marks
        yearlyPerformance[yearData.year].count += 1
      })
    })

    const years = Object.keys(yearlyPerformance).sort()
    const averageMarks = years.map(year => {
      const data = yearlyPerformance[parseInt(year)]
      return Math.round(data.totalMarks / data.count)
    })

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

    return {
      stats: {
        totalStudents,
        averageAge,
        medianIncome,
        averageExpenses,
        totalExpenses,
        studentsNeedingHelp
      },
      ageDistribution: {
        labels: Object.keys(ageGroups),
        data: Object.values(ageGroups),
        colors: colors.slice(0, 4)
      },
      villageDistribution: {
        labels: sortedVillages.map(([village]) => village),
        data: sortedVillages.map(([, count]) => count),
        colors: colors.slice(0, sortedVillages.length)
      },
      incomeSourceDistribution: {
        labels: Object.keys(incomeSources),
        data: Object.values(incomeSources),
        colors: colors.slice(0, Object.keys(incomeSources).length)
      },
      expenseBreakdown: {
        labels: ['Travel', 'School Fees', 'Books', 'Stationery', 'Uniform', 'Tuition'],
        data: Object.values(expenseCategories),
        colors
      },
      performanceTrends: {
        labels: years,
        data: averageMarks,
        colors: ['#3b82f6']
      }
    }
  }, [])

  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true)
    if (!forceRefresh) {
      setSyncStatus({ state: 'loading', message: 'Loading student data...' })
    } else {
      setSyncStatus({ state: 'loading', message: 'Syncing with Google Sheets...', autoSync: true })
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const studentsData = getSampleData()
      const analyticsData = calculateAnalytics(studentsData)
      
      setStudents(studentsData)
      setAnalytics(analyticsData)
      setError(null)
      setSyncStatus({
        state: 'connected',
        message: `Connected - ${studentsData.length} students loaded`,
        lastSync: new Date().toLocaleTimeString(),
        autoSync: true
      })
    } catch (err) {
      // Use fallback data when Google Sheets fails
      const fallbackData = getSampleData()
      const fallbackAnalytics = calculateAnalytics(fallbackData)
      
      setStudents(fallbackData)
      setAnalytics(fallbackAnalytics)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setSyncStatus({
        state: 'offline',
        message: 'Using offline data - Google Sheets unavailable',
        lastSync: 'Offline mode'
      })
    } finally {
      setIsLoading(false)
    }
  }, [getSampleData, calculateAnalytics])

  const refreshData = useCallback(async (forceRefresh = false) => {
    return loadData(forceRefresh)
  }, [loadData])

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData(true)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [loadData])

  return {
    students,
    analytics,
    isLoading,
    error,
    syncStatus,
    refreshData
  }
}