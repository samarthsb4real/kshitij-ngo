"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Student, generateStudentProfilePDF } from '@/lib/pdf-utils'
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
    generateStudentProfilePDF(student)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600 mt-1">{student.currentEducation} • {student.class} • {student.village}</p>
          </div>
          <div className="flex items-center gap-3">
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
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{student.age} years</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{student.phone}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">School:</span>
              <span className="font-medium">{student.school}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Future Plans:</span>
              <span className="font-medium">{student.futurePlans}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Father:</span>
              <span className="font-medium">{student.fatherName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Mother:</span>
              <span className="font-medium">{student.motherName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Parent Ages:</span>
              <span className="font-medium">{student.parentAge}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Parent Education:</span>
              <span className="font-medium">{student.parentEducation}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Family Members:</span>
              <span className="font-medium">{student.totalFamilyMembers} ({student.earningMembers} earning)</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Income Source:</span>
              <span className="font-medium">{student.incomeSource}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Expense Bearer:</span>
              <span className="font-medium">{student.expenseBearer}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Disability:</span>
              <span className="font-medium">{student.disability || 'None'}</span>
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
                  <th className="border border-gray-300 px-4 py-2 text-left">Standard</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Marks/Grade</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{student.academicPerformance.year1.split(',')[0]}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.academicPerformance.year1.split(',')[1]}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{student.academicPerformance.year1.split(',')[2]}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{student.academicPerformance.year2.split(',')[0]}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.academicPerformance.year2.split(',')[1]}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{student.academicPerformance.year2.split(',')[2]}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{student.academicPerformance.year3.split(',')[0]}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.academicPerformance.year3.split(',')[1]}</td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">{student.academicPerformance.year3.split(',')[2]}</td>
                </tr>
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
                <div className="text-2xl font-bold text-green-600">₹{student.familyIncome.toLocaleString()}</div>
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
                { label: 'Travel', amount: student.expenses.travel },
                { label: 'School Fees', amount: student.expenses.fees },
                { label: 'Books', amount: student.expenses.books },
                { label: 'Stationery', amount: student.expenses.stationery },
                { label: 'Uniform', amount: student.expenses.uniform },
                { label: 'Tuition', amount: student.expenses.tuition }
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
                  onStatusChange(student.id, value)
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
              <div>Submitted: {student.submissionDate}</div>
              <div>Needs Help: {student.needsHelp}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}