"use client"

import { useParams } from 'next/navigation'
import { StudentProfile } from '@/components/students/student-profile'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGoogleSheets } from '@/hooks/use-google-sheets'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function StudentDetailPage() {
  const params = useParams()
  const studentId = params.id as string
  
  const { students, isLoading } = useGoogleSheets()
  const student = students.find(s => s.id.toString() === studentId)

  const handleStatusChange = async (studentId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, status })
      })
      
      if (response.ok) {
        // Refresh data to show updated status
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  // Show skeleton while loading or when student data is not yet available
  if (isLoading || (!student && students.length === 0)) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="max-w-4xl mx-auto bg-white">
          {/* Header Skeleton */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-8">
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
            
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-6 mb-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show "Student Not Found" only when data is loaded but student doesn't exist
  if (!isLoading && students.length > 0 && !student) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
          <p className="text-gray-600 mb-4">The student with ID {studentId} could not be found.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
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