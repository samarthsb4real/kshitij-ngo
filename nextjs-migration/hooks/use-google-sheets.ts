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
      // Fetch data directly from Google Sheets using Apps Script
      const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '')
      const sheetsData = await response.json()
      
      if (!response.ok) {
        throw new Error('Failed to fetch from Google Sheets')
      }

      // Convert Google Sheets data to student format
      const studentsData = sheetsData.map((row: any[], index: number) => {
        if (index === 0) return null // Skip header row
        
        return {
          id: index,
          studentName: row[1] || '',
          age: parseInt(row[2]) || 0,
          classStandard: row[7] || '',
          village: row[4] || '',
          schoolCollege: row[8] || '',
          currentEducation: row[6] || '',
          achievements: row[17] || '',
          futurePlans: row[10] || '',
          parentNames: `${row[27] || ''} & ${row[28] || ''}`,
          parentAges: row[29] || '',
          parentEducation: '',
          familySize: parseInt(row[32]) || 0,
          workingMembers: parseInt(row[33]) || 0,
          annualIncome: parseFloat(row[31]) || 0,
          incomeSource: row[30] || '',
          needsHelp: 'Yes',
          phone: row[36] || '',
          address: row[37] || '',
          status: row[38] || 'pending',
          expenses: {
            travel: parseFloat(row[21]) || 0,
            schoolFees: parseFloat(row[18]) || 0,
            books: parseFloat(row[19]) || 0,
            stationery: parseFloat(row[20]) || 0,
            uniform: parseFloat(row[22]) || 0,
            tuition: parseFloat(row[23]) || 0
          },
          yearsReview: [
            { year: 2024, standard: row[11] || '', marks: parseFloat(row[12]) || 0 },
            { year: 2023, standard: row[13] || '', marks: parseFloat(row[14]) || 0 },
            { year: 2022, standard: row[15] || '', marks: parseFloat(row[16]) || 0 }
          ].filter(yr => yr.standard && yr.marks)
        }
      }).filter(Boolean)
      
      if (studentsData.length === 0) {
        throw new Error('No data available from Google Sheets')
      }

      const analyticsData = calculateAnalytics(studentsData)
      
      setStudents(studentsData)
      setAnalytics(analyticsData)
      setError(null)
      setSyncStatus({
        state: 'connected',
        message: `Connected - ${studentsData.length} students loaded from Google Sheets`,
        lastSync: new Date().toLocaleTimeString(),
        autoSync: true
      })
    } catch (err) {
      setStudents([])
      setAnalytics(null)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      setSyncStatus({
        state: 'error',
        message: 'Failed to connect to Google Sheets',
        lastSync: 'Error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [calculateAnalytics])

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