"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Languages, FileText, CheckCircle, Clock } from 'lucide-react'
import { SponsorshipForm } from '@/components/forms/sponsorship-form'
import { LanguageProvider } from '@/components/forms/language-provider'

export default function FormPage() {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [formProgress, setFormProgress] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const languages = useMemo(() => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ], [])

  const features = useMemo(() => [
    "Comprehensive data collection for sponsorship evaluation",
    "Input validation to ensure data accuracy", 
    "Multi-language support (English, Hindi, Marathi)",
    "Automatic age calculation and expense totaling",
    "Direct Google Sheets integration for data storage",
    "Progress tracking with section completion indicators",
    "Email notifications for new applications",
    "Mobile-friendly responsive design",
    "Age restriction validation (up to 21 years)"
  ], [])

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for your application. We will review it and contact you soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => setIsSubmitted(false)} className="w-full">
              Submit Another Application
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Clear Form
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <LanguageProvider language={currentLanguage}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                Student Sponsorship Application Form
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Kshitij NGO
              </p>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
                Apply for educational sponsorship to support your academic journey. 
                Our comprehensive form ensures we understand your needs and circumstances to provide the best possible assistance.
              </p>
              
              {/* Language Selection */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  <span className="font-medium">Language:</span>
                </div>
                <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                  <SelectTrigger className="w-48 bg-white text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Form Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span className="font-medium">{Math.round(formProgress)}%</span>
                      </div>
                      <Progress value={formProgress} className="h-2" />
                      <p className="text-xs text-gray-600">
                        Fill out all sections to complete your application
                      </p>
                    </div>
                  </CardContent>
                </Card>


                {/* Features Card 
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Form Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
*/}
                {/* Languages Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <Badge 
                          key={lang.code} 
                          variant={currentLanguage === lang.code ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => setCurrentLanguage(lang.code)}
                        >
                          {lang.nativeName}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <SponsorshipForm 
                    language={currentLanguage}
                    onProgressChange={setFormProgress}
                    onSubmit={() => setIsSubmitted(true)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  )
}