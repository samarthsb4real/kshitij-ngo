"use client"

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { StudentProfile } from '@/components/students/student-profile'
import { Button } from '@/components/ui/button'
import { mockStudents } from '@/lib/student-data'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string
  
  const [students, setStudents] = useState(mockStudents)
  const student = students.find(s => s.id === studentId)

  const handleStatusChange = (studentId: string, status: 'pending' | 'approved' | 'rejected') => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ))
  }

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
          <Link href="/students">
            <Button>Back to Students</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <StudentProfile
        student={student}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}