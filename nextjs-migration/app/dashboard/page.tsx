"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  GraduationCap,
  RefreshCw,
  Settings,
  Search,
  Filter,
  Home,
  FileText,
  Download
} from 'lucide-react'
import { EnhancedStatsCards } from '@/components/dashboard/enhanced-stats-cards'
import { ChartsGrid } from '@/components/dashboard/charts-grid'
import { StudentsTable } from '@/components/dashboard/students-table'
import { SyncStatus } from '@/components/dashboard/sync-status'
import { useGoogleSheets } from '@/hooks/use-google-sheets'
import { useToast } from '@/hooks/use-toast'
import { exportTodaysSubmissions, exportAllSubmissions, getStoredSubmissions, clearAllSubmissions } from '@/lib/excel-utils'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [villageFilter, setVillageFilter] = useState('all')
  const [submissionCount, setSubmissionCount] = useState(0)
  const { 
    students, 
    analytics, 
    isLoading, 
    error, 
    syncStatus, 
    refreshData 
  } = useGoogleSheets()
  const { toast } = useToast()

  useEffect(() => {
    // Update submission count
    setSubmissionCount(getStoredSubmissions().length)
  }, [])

  const handleRefresh = async () => {
    try {
      await refreshData(true)
      toast({
        title: "Data refreshed",
        description: "Successfully updated student data from Google Sheets",
      })
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to update data. Using cached information.",
        variant: "destructive",
      })
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.currentEducation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVillage = villageFilter === 'all' || student.village === villageFilter
    return matchesSearch && matchesVillage
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Sponsorship Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Project under Development for Kshitij NGO
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/form">
                  <FileText className="w-4 h-4 mr-2" />
                  Apply
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sync Status */}
        <SyncStatus status={syncStatus} onRefresh={handleRefresh} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {analytics && <EnhancedStatsCards analytics={analytics} />}
              
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates and student progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {students.slice(0, 3).map((student) => (
                        <Link key={student.id} href={`/students/${student.id}`}>
                          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{student.studentName}</p>
                              <p className="text-sm text-gray-600">{student.currentEducation}</p>
                            </div>
                            <Badge variant="secondary">{student.village}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('students')}>
                      <Users className="w-4 h-4 mr-2" />
                      View Students
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={exportTodaysSubmissions}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Today's Forms
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={exportAllSubmissions}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Export All Forms
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              {analytics && <EnhancedStatsCards analytics={analytics} />}
              {analytics && <ChartsGrid analytics={analytics} />}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Students List</CardTitle>
                    <CardDescription>
                      Manage and view all sponsored students
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="age">Age</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="village">Village</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={villageFilter} onValueChange={setVillageFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by Village" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Villages</SelectItem>
                        <SelectItem value="Kondhur">Kondhur</SelectItem>
                        <SelectItem value="Shivapur">Shivapur</SelectItem>
                        <SelectItem value="Wadgaon">Wadgaon</SelectItem>
                        <SelectItem value="Karjat">Karjat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StudentsTable 
                  students={filteredStudents} 
                  sortBy={sortBy}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Submissions Management</CardTitle>
                  <CardDescription>
                    Manage and export form submissions stored locally
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Total Stored Submissions</p>
                        <p className="text-sm text-gray-600">{submissionCount} form submissions in local storage</p>
                      </div>
                      <Badge variant="secondary">{submissionCount}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={exportTodaysSubmissions} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Today's Forms
                    </Button>
                    <Button onClick={exportAllSubmissions} variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Forms
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => {
                        if (clearAllSubmissions()) {
                          setSubmissionCount(0)
                          toast({
                            title: "Submissions cleared",
                            description: "All form submissions have been removed from local storage",
                          })
                        }
                      }} 
                      variant="destructive" 
                      size="sm"
                    >
                      Clear All Submissions
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      This will permanently delete all locally stored form submissions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Google Sheets Integration</CardTitle>
                  <CardDescription>
                    Configure your Google Sheets connection for data sync
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium">Google Sheet ID</label>
                      <Input placeholder="1ABC...XYZ" className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        Found in your Google Sheet URL between /d/ and /edit
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">API Key</label>
                      <Input type="password" placeholder="AIza...abc" className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        Get this from Google Cloud Console
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sheet Name</label>
                      <Input placeholder="students" defaultValue="students" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>Save Configuration</Button>
                    <Button variant="outline">Test Connection</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Sync Settings</CardTitle>
                  <CardDescription>
                    Configure automatic data synchronization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-sync data</p>
                      <p className="text-sm text-gray-600">Automatically sync every 5 minutes</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Offline mode</p>
                      <p className="text-sm text-gray-600">Use cached data when offline</p>
                    </div>
                    <Button variant="outline" size="sm">Disable</Button>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">Clear Cache</Button>
                    <Button variant="outline">Export Data</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}