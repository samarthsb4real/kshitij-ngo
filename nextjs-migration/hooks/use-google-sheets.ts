"use client"

import { useState, useEffect, useCallback } from 'react'
import { Student, AnalyticsData, SyncStatus } from '@/types'

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
    if (studentsData.length === 0) {
      return {
        stats: {
          totalStudents: 0,
          averageAge: 0,
          medianIncome: 0,
          averageExpenses: 0,
          totalExpenses: 0,
          studentsNeedingHelp: 0
        },
        ageDistribution: { labels: [], data: [], colors: [] },
        villageDistribution: { labels: [], data: [], colors: [] },
        incomeSourceDistribution: { labels: [], data: [], colors: [] },
        expenseBreakdown: { labels: [], data: [], colors: [] },
        performanceTrends: { labels: [], data: [], colors: [] }
      }
    }

    const totalStudents = studentsData.length
    const totalAge = studentsData.reduce((sum, student) => sum + student.age, 0)
    const averageAge = Math.round(totalAge / totalStudents)

    const incomes = studentsData.map(s => s.familyYearlyIncome).sort((a, b) => a - b)
    const medianIncome = incomes[Math.floor(incomes.length / 2)]

    const totalExpenses = studentsData.reduce((sum, student) => sum + student.totalExpenses, 0)
    const averageExpenses = Math.round(totalExpenses / totalStudents)

    // Count students with low income relative to expenses
    const studentsNeedingHelp = studentsData.filter(s => s.familyYearlyIncome < s.totalExpenses * 12).length

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

    // Income source distribution (based on father occupation)
    const incomeSources: { [key: string]: number } = {}
    studentsData.forEach(student => {
      const occupation = student.fatherOccupation || 'Unknown'
      incomeSources[occupation] = (incomeSources[occupation] || 0) + 1
    })

    // Expense breakdown
    const expenseCategories = {
      tuition: 0,
      books: 0,
      stationery: 0,
      travel: 0,
      uniform: 0,
      examFees: 0,
      hostel: 0,
      other: 0
    }
    studentsData.forEach(student => {
      expenseCategories.tuition += student.tuitionFees || 0
      expenseCategories.books += student.booksCost || 0
      expenseCategories.stationery += student.stationeryCost || 0
      expenseCategories.travel += student.travelCost || 0
      expenseCategories.uniform += student.uniformCost || 0
      expenseCategories.examFees += student.examFees || 0
      expenseCategories.hostel += student.hostelFees || 0
      expenseCategories.other += student.otherExpenses || 0
    })

    // Performance trends based on year marks
    const yearlyPerformance: { [key: string]: { totalMarks: number, count: number } } = {}
    studentsData.forEach(student => {
      if (student.year1Marks) {
        const marks = parseFloat(student.year1Marks)
        if (!isNaN(marks)) {
          const label = student.year1Class || 'Year 1'
          if (!yearlyPerformance[label]) {
            yearlyPerformance[label] = { totalMarks: 0, count: 0 }
          }
          yearlyPerformance[label].totalMarks += marks
          yearlyPerformance[label].count += 1
        }
      }
      if (student.year2Marks) {
        const marks = parseFloat(student.year2Marks)
        if (!isNaN(marks)) {
          const label = student.year2Class || 'Year 2'
          if (!yearlyPerformance[label]) {
            yearlyPerformance[label] = { totalMarks: 0, count: 0 }
          }
          yearlyPerformance[label].totalMarks += marks
          yearlyPerformance[label].count += 1
        }
      }
      if (student.year3Marks) {
        const marks = parseFloat(student.year3Marks)
        if (!isNaN(marks)) {
          const label = student.year3Class || 'Year 3'
          if (!yearlyPerformance[label]) {
            yearlyPerformance[label] = { totalMarks: 0, count: 0 }
          }
          yearlyPerformance[label].totalMarks += marks
          yearlyPerformance[label].count += 1
        }
      }
    })

    const years = Object.keys(yearlyPerformance).sort()
    const averageMarks = years.map(year => {
      const data = yearlyPerformance[year]
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
        labels: ['Tuition', 'Books', 'Stationery', 'Travel', 'Uniform', 'Exam Fees', 'Hostel', 'Other'],
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
      // Maps all 43 columns from Apps Script schema
      const studentsData = sheetsData.map((row: any[], index: number) => {
        if (index === 0) return null // Skip header row
        
        return {
          id: index,
          // Column A (0) - Timestamp
          timestamp: row[0] || '',
          // Columns B-E (1-4) - Student Name Fields
          studentName: row[1] || '',
          firstName: row[2] || '',
          middleName: row[3] || '',
          lastName: row[4] || '',
          // Column F (5) - Photo
          photo: row[5] || '',
          // Columns G-J (6-9) - Basic Info
          age: parseInt(row[6]) || 0,
          dateOfBirth: row[7] || '',
          village: row[8] || '',
          disability: row[9] || 'None',
          // Columns K-O (10-14) - Education Info
          currentEducation: row[10] || '',
          currentYear: row[11] || '',
          schoolName: row[12] || '',
          otherEducation: row[13] || '',
          futurePlans: row[14] || '',
          // Columns P-U (15-20) - Academic Performance
          year1Class: row[15] || '',
          year1Marks: row[16] || '',
          year2Class: row[17] || '',
          year2Marks: row[18] || '',
          year3Class: row[19] || '',
          year3Marks: row[20] || '',
          // Column V (21) - Achievements
          achievements: row[21] || '',
          // Columns W-AE (22-30) - Financial Info (Expenses)
          tuitionFees: parseFloat(row[22]) || 0,
          booksCost: parseFloat(row[23]) || 0,
          stationeryCost: parseFloat(row[24]) || 0,
          travelCost: parseFloat(row[25]) || 0,
          uniformCost: parseFloat(row[26]) || 0,
          examFees: parseFloat(row[27]) || 0,
          hostelFees: parseFloat(row[28]) || 0,
          otherExpenses: parseFloat(row[29]) || 0,
          totalExpenses: parseFloat(row[30]) || 0,
          // Columns AF-AN (31-39) - Family Info
          fatherName: row[31] || '',
          motherName: row[32] || '',
          fatherAge: row[33] || '',
          fatherOccupation: row[34] || '',
          fatherIncome: parseFloat(row[35]) || 0,
          familyYearlyIncome: parseFloat(row[36]) || 0,
          totalFamilyMembers: parseInt(row[37]) || 0,
          earningMembers: parseInt(row[38]) || 0,
          educationExpenseBearer: row[39] || '',
          // Columns AO-AQ (40-42) - Contact Info
          phoneNumber: row[40] || '',
          address: row[41] || '',
          pincode: row[42] || '',
          // Column AR (43) - Application Status
          status: (row[43] || 'pending') as 'pending' | 'approved' | 'rejected'
        }
      }).filter(Boolean) as Student[]
      
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