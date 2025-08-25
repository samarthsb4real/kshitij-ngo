"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, DollarSign, GraduationCap } from 'lucide-react'

interface AnalyticsData {
  stats: {
    totalStudents: number
    averageAge: number
    medianIncome: number
    averageExpenses: number
    totalExpenses: number
    studentsNeedingHelp: number
  }
}

interface StatsCardsProps {
  analytics: AnalyticsData | null
}

export function StatsCards({ analytics }: StatsCardsProps) {
  const stats = analytics?.stats || {
    totalStudents: 0,
    averageAge: 0,
    medianIncome: 0,
    averageExpenses: 0,
    totalExpenses: 0,
    studentsNeedingHelp: 0
  }

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Average Age",
      value: `${stats.averageAge} years`,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Median Income",
      value: `₹${stats.medianIncome.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Average Expenses",
      value: `₹${stats.averageExpenses.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="ngo-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {index === 0 && "Active sponsorships"}
                {index === 1 && "Student demographics"}
                {index === 2 && "Family income level"}
                {index === 3 && "Educational costs"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}