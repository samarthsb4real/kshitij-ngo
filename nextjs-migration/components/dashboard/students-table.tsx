"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Phone, MapPin, GraduationCap, Grid3X3, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

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
  status?: string
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
  const [isCompactView, setIsCompactView] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  
  const studentsPerPage = isCompactView ? itemsPerPage : 6

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
  
  // Reset to page 1 when changing view or items per page
  const handleViewChange = (compact: boolean) => {
    setIsCompactView(compact)
    setCurrentPage(1)
  }
  
  const handleItemsPerPageChange = (items: string) => {
    setItemsPerPage(parseInt(items))
    setCurrentPage(1)
  }
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const calculateTotalExpenses = (expenses: { [key: string]: number }) => {
    return Object.values(expenses).reduce((sum, exp) => sum + (exp || 0), 0)
  }

  return (
    <div className="space-y-4">
      {/* View Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={!isCompactView ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewChange(false)}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Card View
            </Button>
            <Button
              variant={isCompactView ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewChange(true)}
            >
              <List className="w-4 h-4 mr-1" />
              Compact
            </Button>
          </div>
          
          {isCompactView && (
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedStudents.length)} of {sortedStudents.length} students
        </div>
      </div>

      {/* Students Grid/List */}
      <div className={isCompactView ? "space-y-2" : "grid gap-4"}>
        {currentStudents.map((student) => {
          const totalExpenses = calculateTotalExpenses(student.expenses)
          
          if (isCompactView) {
            return (
              <div key={student.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{student.studentName}</h3>
                      <Badge className={`text-xs ${student.status === 'approved' ? 'bg-green-100 text-green-800' : student.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {(student.status || 'pending').charAt(0).toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{student.age}y</span>
                      <span>{student.village}</span>
                      <span>₹{totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/students/${student.id}`}>
                      <Eye className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            )
          }
          
          return (
            <Card key={student.id} className="ngo-card-hover cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {student.studentName}
                          </h3>
                          <Badge className={`${student.status === 'approved' ? 'bg-green-100 text-green-800' : student.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {(student.status || 'pending').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {student.currentEducation}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
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
                        <span className="text-gray-500">School:</span>
                        <span className="font-medium text-xs">{student.schoolCollege}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Income:</span>
                        <span className="font-medium">₹{student.annualIncome.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Education Expenses:</span>
                        <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                          ₹{totalExpenses.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Gap:</span>
                        <Badge variant="secondary" className={totalExpenses > student.annualIncome ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100'}>
                          {totalExpenses > student.annualIncome ? '-' : '+'}₹{Math.abs(student.annualIncome - totalExpenses).toLocaleString()}
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

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {sortedStudents.length} total students
          </div>
        </div>
      )}
    </div>
  )
}