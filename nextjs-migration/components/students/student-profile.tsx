"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Student as PDFStudent, generateStudentProfilePDF } from '@/lib/pdf-utils'
import { Student } from '@/types'
import { Download, DollarSign } from 'lucide-react'

interface StudentProfileProps {
  student: Student
  onStatusChange: (studentId: string, status: 'pending' | 'approved' | 'rejected') => void
}

export function StudentProfile({ student, onStatusChange }: StudentProfileProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleExportPDF = () => {
    const pdfStudent: PDFStudent = {
      id: student.id.toString(),
      name: student.studentName,
      age: student.age,
      class: student.currentYear,
      village: student.village,
      school: student.schoolName,
      currentEducation: student.currentEducation,
      academicPerformance: {
        year1: student.year1Class && student.year1Marks ? `${student.year1Class}, ${student.year1Marks}%` : '',
        year2: student.year2Class && student.year2Marks ? `${student.year2Class}, ${student.year2Marks}%` : '',
        year3: student.year3Class && student.year3Marks ? `${student.year3Class}, ${student.year3Marks}%` : ''
      },
      achievements: student.achievements || '',
      futurePlans: student.futurePlans,
      disability: student.disability,
      fatherName: student.fatherName,
      motherName: student.motherName,
      parentAge: student.fatherAge,
      parentEducation: 'Not specified',
      totalFamilyMembers: student.totalFamilyMembers,
      earningMembers: student.earningMembers,
      phone: student.phoneNumber,
      address: student.address,
      status: student.status || 'pending',
      expenses: {
        travel: student.travelCost,
        fees: student.tuitionFees,
        books: student.booksCost,
        stationery: student.stationeryCost,
        uniform: student.uniformCost,
        tuition: student.tuitionFees,
        other: student.otherExpenses
      },
      totalExpenses: student.totalExpenses,
      familyIncome: student.familyYearlyIncome,
      incomeSource: student.fatherOccupation,
      expenseBearer: student.educationExpenseBearer,
      needsHelp: 'Yes',
      submissionDate: student.timestamp || new Date().toISOString()
    }
    generateStudentProfilePDF(pdfStudent)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <div className="flex justify-between items-start gap-6">
          <div className="flex gap-6 flex-1">
            {/* Student Photo */}
            {student.photo && (
              <div className="flex-shrink-0">
                <img 
                  src={student.photo} 
                  alt={student.studentName} 
                  className="w-40 h-40 rounded-xl object-cover border-4 border-primary/20 shadow-lg" 
                />
              </div>
            )}
            
            {/* Student Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{student.studentName}</h1>
              <p className="text-gray-600 mt-1">{student.currentEducation} • {student.currentYear} • {student.village}</p>
              
              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-xs">Age: {student.age}</Badge>
                <Badge variant="outline" className="text-xs">📍 {student.village}</Badge>
                <Badge variant="outline" className="text-xs">🏫 {student.schoolName}</Badge>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col items-end gap-3">
            <Badge className={getStatusColor(student.status)}>
              {student.status.toUpperCase()}
            </Badge>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-8">
        
        {/* Basic Information Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Full Name:</span>
              <span className="font-medium">{student.firstName} {student.middleName} {student.lastName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{student.age} years</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">{student.dateOfBirth}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{student.phoneNumber}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">School:</span>
              <span className="font-medium">{student.schoolName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Current Year:</span>
              <span className="font-medium">{student.currentYear}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Future Plans:</span>
              <span className="font-medium">{student.futurePlans}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Disability:</span>
              <span className="font-medium">{student.disability}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Village:</span>
              <span className="font-medium">{student.village}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Pincode:</span>
              <span className="font-medium">{student.pincode}</span>
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Family Information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Father's Name:</span>
              <span className="font-medium">{student.fatherName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Mother's Name:</span>
              <span className="font-medium">{student.motherName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Father's Age:</span>
              <span className="font-medium">{student.fatherAge}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Father's Occupation:</span>
              <span className="font-medium">{student.fatherOccupation}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Father's Income:</span>
              <span className="font-medium">₹{student.fatherIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Family Yearly Income:</span>
              <span className="font-medium">₹{student.familyYearlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Family Members:</span>
              <span className="font-medium">{student.totalFamilyMembers} ({student.earningMembers} earning)</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Education Expense Bearer:</span>
              <span className="font-medium">{student.educationExpenseBearer}</span>
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Class/Standard</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Marks/Grade</th>
                </tr>
              </thead>
              <tbody>
                {student.year1Class && student.year1Marks && (
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Year 1</td>
                    <td className="border border-gray-300 px-4 py-2">{student.year1Class}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{student.year1Marks}</td>
                  </tr>
                )}
                {student.year2Class && student.year2Marks && (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Year 2</td>
                    <td className="border border-gray-300 px-4 py-2">{student.year2Class}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{student.year2Marks}</td>
                  </tr>
                )}
                {student.year3Class && student.year3Marks && (
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Year 3</td>
                    <td className="border border-gray-300 px-4 py-2">{student.year3Class}</td>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{student.year3Marks}</td>
                  </tr>
                )}
                {!student.year1Class && !student.year2Class && !student.year3Class && (
                  <tr>
                    <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      No academic records available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {student.achievements && (
            <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-sm font-semibold text-blue-900 mb-1">Achievements & Awards</div>
              <div className="text-blue-800">{student.achievements}</div>
            </div>
          )}
        </div>

        {/* Financial Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Overview
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Annual Family Income</div>
                <div className="text-2xl font-bold text-green-600">₹{student.familyYearlyIncome.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Total Education Expenses</div>
                <div className="text-2xl font-bold text-red-600">₹{student.totalExpenses.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Expense Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: 'Tuition Fees', amount: student.tuitionFees },
                { label: 'Books Cost', amount: student.booksCost },
                { label: 'Stationery Cost', amount: student.stationeryCost },
                { label: 'Travel Cost', amount: student.travelCost },
                { label: 'Uniform Cost', amount: student.uniformCost },
                { label: 'Exam Fees', amount: student.examFees },
                { label: 'Hostel Fees', amount: student.hostelFees },
                { label: 'Other Expenses', amount: student.otherExpenses }
              ].map((expense) => (
                <div key={expense.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">{expense.label}</span>
                  <span className="font-medium">₹{expense.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 font-semibold text-lg border-t-2 border-gray-300 mt-2">
                <span>Total</span>
                <span>₹{student.totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <p className="text-gray-700 bg-gray-50 p-4 rounded">{student.address}</p>
        </div>

        {/* Status Management */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Application Status</label>
              <Select
                value={student.status}
                onValueChange={(value: 'pending' | 'approved' | 'rejected') => 
                  onStatusChange(student.id.toString(), value)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500 text-right">
              <div>Submission Date: {new Date(student.timestamp).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}