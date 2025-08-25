"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Phone, MapPin, GraduationCap } from 'lucide-react'

interface Student {
  id: number
  studentName: string
  age: number
  classStandard: string
  village: string
  schoolCollege: string
  currentEducation: string
  annualIncome: number
  phone: string
  expenses: {
    [key: string]: number
  }
}

interface StudentsTableProps {
  students: Student[]
  sortBy: string
  isLoading: boolean
}

export function StudentsTable({ students, sortBy, isLoading }: StudentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 6

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  // Sort students
  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.studentName.localeCompare(b.studentName)
      case 'age':
        return a.age - b.age
      case 'income':
        return a.annualIncome - b.annualIncome
      case 'village':
        return a.village.localeCompare(b.village)
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage)
  const startIndex = (currentPage - 1) * studentsPerPage
  const endIndex = startIndex + studentsPerPage
  const currentStudents = sortedStudents.slice(startIndex, endIndex)

  const calculateTotalExpenses = (expenses: { [key: string]: number }) => {
    return Object.values(expenses).reduce((sum, exp) => sum + (exp || 0), 0)
  }

  return (
    <div className="space-y-4">
      {/* Students Grid */}
      <div className="grid gap-4">
        {currentStudents.map((student) => {
          const totalExpenses = calculateTotalExpenses(student.expenses)
          
          return (
            <Card key={student.id} className="ngo-card-hover cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {student.studentName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {student.currentEducation}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Age:</span>
                        <span className="font-medium">{student.age} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Class:</span>
                        <span className="font-medium">{student.classStandard}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{student.village}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{student.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Annual Income:</span>
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          ₹{student.annualIncome.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Total Expenses:</span>
                        <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                          ₹{totalExpenses.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/students/${student.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedStudents.length)} of {sortedStudents.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}