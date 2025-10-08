"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Student } from '@/lib/pdf-utils'
import { Search, Filter, Eye } from 'lucide-react'

interface StudentsListProps {
  students: Student[]
  onStudentSelect: (student: Student) => void
  onStatusChange: (studentId: string, status: 'pending' | 'approved' | 'rejected') => void
}

export function StudentsList({ students, onStudentSelect, onStatusChange }: StudentsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.school.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students ({filteredStudents.length})</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, village, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-600">
                    <span><span className="font-medium">Age:</span> {student.age} years</span>
                    <span><span className="font-medium">Class:</span> {student.class}</span>
                    <span><span className="font-medium">Village:</span> {student.village}</span>
                    <span><span className="font-medium">School:</span> {student.school}</span>
                    <span><span className="font-medium">Phone:</span> {student.phone}</span>
                    <span><span className="font-medium">Expenses:</span> ₹{student.totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStudentSelect(student)}
                    className="whitespace-nowrap"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Select
                    value={student.status}
                    onValueChange={(value: 'pending' | 'approved' | 'rejected') => 
                      onStatusChange(student.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}