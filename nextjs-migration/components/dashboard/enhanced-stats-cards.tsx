"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  GraduationCap,
  Download,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { generateDashboardStatsPDF } from '@/lib/pdf-utils'
import { mockStudents } from '@/lib/student-data'

interface AnalyticsData {
  stats: {
    totalStudents: number
    averageAge: number
    medianIncome: number
    averageExpenses: number
    totalExpenses: number
    studentsNeedingHelp: number
  }
  ageDistribution: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  villageDistribution: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  incomeSourceDistribution: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  expenseBreakdown: {
    labels: string[]
    data: number[]
    colors: string[]
  }
  performanceTrends: {
    labels: string[]
    data: number[]
    colors: string[]
  }
}

interface EnhancedStatsCardsProps {
  analytics: AnalyticsData
}

export function EnhancedStatsCards({ analytics }: EnhancedStatsCardsProps) {
  // Handle null analytics
  if (!analytics) {
    return <div>Loading...</div>
  }

  // Calculate status-based stats from mock data
  const approved = mockStudents.filter(s => s.status === 'approved').length
  const pending = mockStudents.filter(s => s.status === 'pending').length
  const rejected = mockStudents.filter(s => s.status === 'rejected').length
  const totalFunding = mockStudents.reduce((sum, s) => sum + s.totalExpenses, 0)
  const avgIncome = mockStudents.reduce((sum, s) => sum + s.familyIncome, 0) / mockStudents.length

  const handleExportStats = () => {
    const stats = {
      totalStudents: analytics.stats.totalStudents,
      approved,
      pending,
      rejected,
      totalFunding,
      avgIncome: Math.round(avgIncome),
      students: mockStudents
    }
    generateDashboardStatsPDF(stats)
  }

  const cards = [
    {
      title: 'Total Students',
      value: analytics.stats.totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Registered students'
    },
    {
      title: 'Approved',
      value: approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Applications approved'
    },
    {
      title: 'Pending Review',
      value: pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Awaiting approval'
    },
    {
      title: 'Rejected',
      value: rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Applications rejected'
    },
    {
      title: 'Total Funding Required',
      value: `₹${totalFunding.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Annual expenses'
    },
    {
      title: 'Average Family Income',
      value: `₹${Math.round(avgIncome).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      description: 'Per family annually'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button onClick={handleExportStats} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Stats PDF
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color} mb-1`}>
                  {card.value}
                </div>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                Approved: {approved}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                Pending: {pending}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">
                Rejected: {rejected}
              </Badge>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-gray-600">
                Approval Rate: {Math.round((approved / analytics.stats.totalStudents) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}