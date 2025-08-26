import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, FileText, Settings } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Kshitij NGO
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Student Sponsorship Program
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Supporting students from rural areas in their educational journey through comprehensive sponsorship and mentorship programs.
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="ngo-card-hover border-2 hover:border-primary">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Dashboard</CardTitle>
              <CardDescription className="text-base">
                View analytics, manage students, and track sponsorship progress
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full">
                  Access Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="ngo-card-hover border-2 hover:border-primary">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Apply for Sponsorship</CardTitle>
              <CardDescription className="text-base">
                Submit your application for educational sponsorship support
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/form">
                <Button size="lg" variant="outline" className="w-full">
                  Fill Application
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section 
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Program Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Management</h3>
              <p className="text-gray-600">
                Comprehensive tracking of student progress, expenses, and academic performance
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Real-time insights into program impact, demographics, and financial data
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-language Support</h3>
              <p className="text-gray-600">
                Available in English, Hindi, and Marathi for better accessibility
              </p>
            </div>
          </div>
        </div>
    */}

        {/* Statistics 
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Impact
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">6</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">₹2.9L</div>
              <div className="text-gray-600">Total Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">19</div>
              <div className="text-gray-600">Average Age</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-gray-600">Villages Covered</div>
            </div>
          </div>
        </div>
    */}
      </div>
    </div>
  )
}