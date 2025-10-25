"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface AnalyticsData {
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

interface ChartsGridProps {
  analytics: AnalyticsData | null
}

export function ChartsGrid({ analytics }: ChartsGridProps) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-64 bg-gray-100 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Transform data for recharts - all dynamic from Google Sheets
  const ageData = analytics.ageDistribution.labels.map((label, index) => ({
    name: label,
    value: analytics.ageDistribution.data[index],
    fill: analytics.ageDistribution.colors[index]
  })).filter(item => item.value > 0)

  const villageData = analytics.villageDistribution.labels.map((label, index) => ({
    name: label,
    value: analytics.villageDistribution.data[index],
    fill: analytics.villageDistribution.colors[index]
  })).filter(item => item.value > 0)

  const incomeData = analytics.incomeSourceDistribution.labels.map((label, index) => ({
    name: label,
    value: analytics.incomeSourceDistribution.data[index],
    fill: analytics.incomeSourceDistribution.colors[index]
  })).filter(item => item.value > 0)

  const expenseData = analytics.expenseBreakdown.labels.map((label, index) => ({
    name: label,
    value: analytics.expenseBreakdown.data[index],
    fill: analytics.expenseBreakdown.colors[index]
  })).filter(item => item.value > 0)

  const performanceData = analytics.performanceTrends.labels.map((label, index) => ({
    year: label,
    marks: analytics.performanceTrends.data[index]
  })).filter(item => item.marks > 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age Distribution - Dynamic */}
      {ageData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution ({ageData.reduce((sum, item) => sum + item.value, 0)} students)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Income Sources - Dynamic */}
      {incomeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Family Income Sources ({incomeData.reduce((sum, item) => sum + item.value, 0)} families)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} families`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Villages Distribution - Dynamic */}
      {villageData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students by Village (Top {villageData.length} villages)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={villageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Educational Expenses - Dynamic */}
      {expenseData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Total Education Expenses (₹{expenseData.reduce((sum, item) => sum + item.value, 0).toLocaleString()})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Academic Performance Trends - Dynamic */}
      {performanceData.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Academic Performance Trends ({performanceData.length} years of data)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Average Marks']} />
                <Line 
                  type="monotone" 
                  dataKey="marks" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      {/* No Data Message */}
      {ageData.length === 0 && incomeData.length === 0 && villageData.length === 0 && expenseData.length === 0 && (
        <Card className="lg:col-span-2">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No analytics data available. Charts will appear once student data is loaded from Google Sheets.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}