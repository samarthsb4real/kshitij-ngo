"use client"

import { useState, useEffect } from 'react'
import { StudentProfile } from '@/components/students/student-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Student, generateDashboardStatsPDF } from '@/lib/pdf-utils'
import { useGoogleSheets } from '@/hooks/use-google-sheets'
import { Download, BarChart3 } from 'lucide-react'

export default function StudentsPage() {
  const { students: sheetsStudents } = useGoogleSheets()
  const [students, setStudents] = useState<Student[]>([])
  
  useEffect(() => {
    // Convert sheets data to Student format
    const convertedStudents = sheetsStudents.map(s => ({
      id: s.id.toString(),
      name: s.studentName,
      age: s.age,
      class: s.classStandard,
      village: s.village,
      school: s.schoolCollege,
      currentEducation: s.currentEducation,
      academicPerformance: {
        year1: s.yearsReview[0] ? `${s.yearsReview[0].year}, ${s.yearsReview[0].standard}, ${s.yearsReview[0].marks}%` : '',
        year2: s.yearsReview[1] ? `${s.yearsReview[1].year}, ${s.yearsReview[1].standard}, ${s.yearsReview[1].marks}%` : '',
        year3: s.yearsReview[2] ? `${s.yearsReview[2].year}, ${s.yearsReview[2].standard}, ${s.yearsReview[2].marks}%` : ''
      },
      achievements: s.achievements,
      futurePlans: s.futurePlans,
      disability: 'None',
      fatherName: s.parentNames.split(' & ')[0],
      motherName: s.parentNames.split(' & ')[1] || '',
      parentAge: s.parentAges,
      parentEducation: s.parentEducation,
      totalFamilyMembers: s.familySize,
      earningMembers: s.workingMembers,
      phone: s.phone,
      address: s.address,
      status: Math.random() > 0.5 ? 'approved' : 'pending' as 'pending' | 'approved' | 'rejected',
      expenses: s.expenses,
      totalExpenses: Object.values(s.expenses).reduce((sum, exp) => sum + exp, 0),
      familyIncome: s.annualIncome,
      incomeSource: s.incomeSource,
      expenseBearer: 'Parents',
      needsHelp: s.needsHelp,
      submissionDate: '2025-02-07'
    }))
    setStudents(convertedStudents)
  }, [sheetsStudents])
  const [stats, setStats] = useState({
    totalStudents: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalFunding: 0,
    avgIncome: 0
  })

  useEffect(() => {
    // Calculate stats
    const totalStudents = students.length
    const approved = students.filter(s => s.status === 'approved').length
    const pending = students.filter(s => s.status === 'pending').length
    const rejected = students.filter(s => s.status === 'rejected').length
    const totalFunding = students.reduce((sum, s) => sum + s.totalExpenses, 0)
    const avgIncome = students.reduce((sum, s) => sum + s.familyIncome, 0) / totalStudents

    setStats({
      totalStudents,
      approved,
      pending,
      rejected,
      totalFunding,
      avgIncome: Math.round(avgIncome)
    })
  }, [students])

  const handleStatusChange = (studentId: string, status: 'pending' | 'approved' | 'rejected') => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ))
  }

  const handleExportStats = () => {
    generateDashboardStatsPDF({ ...stats, students })
  }



  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <Button onClick={handleExportStats}>
            <Download className="h-4 w-4 mr-2" />
            Export Stats PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Funding Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalFunding.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Family Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.avgIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div className="grid gap-6">
        {students.map((student) => (
          <StudentProfile
            key={student.id}
            student={student}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  )
}