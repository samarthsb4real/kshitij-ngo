"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Play, Loader2 } from 'lucide-react'

export default function TestSheetsPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runConnectionTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/google-sheets?action=test')
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to test connection'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const submitTestForm = async () => {
    setIsLoading(true)
    try {
      const testData = {
        studentName: 'Test Student',
        age: 20,
        dateOfBirth: '2003-01-01',
        villageName: 'Test Village',
        disability: 'None',
        currentEducation: 'Test Education',
        currentYear: '12th',
        schoolName: 'Test School',
        futurePlans: 'Test career plans',
        tuitionFees: 5000,
        booksCost: 2000,
        stationeryCost: 1000,
        travelCost: 500,
        uniformCost: 1000,
        examFees: 500,
        hostelFees: 0,
        otherExpenses: 0,
        totalExpenses: 10000,
        fatherName: 'Test Father',
        fatherAge: 45,
        fatherOccupation: 'Farmer',
        fatherIncome: 25000,
        familyYearlyIncome: 30000,
        totalFamilyMembers: 4,
        earningMembers: 1,
        educationExpenseBearer: 'Parents',
        phoneNumber: '9876543210',
        address: 'Test Address'
      }

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to submit test form'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Sheets Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={runConnectionTest} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Test Connection
              </Button>
              <Button onClick={submitTestForm} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Submit Test Form
              </Button>
            </div>

            {testResult && (
              <div className="mt-6 p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {testResult.success ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </div>
                
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}