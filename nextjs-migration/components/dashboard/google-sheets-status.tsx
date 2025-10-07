"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export function GoogleSheetsStatus() {
  const { toast } = useToast()
  const isConfigured = !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

  const testConnection = async () => {
    try {
      const response = await fetch('/api/test-sheets')
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Test Successful!",
          description: result.message,
        })
      } else {
        toast({
          title: "Test Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not connect to test endpoint",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Integration</CardTitle>
        <CardDescription>
          Configure your Google Sheets connection for form submissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Google Apps Script URL</label>
            <Input 
              placeholder="https://script.google.com/macros/s/.../exec" 
              className="mt-1"
              defaultValue={process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || ''}
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              Configure in .env.local file
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Connection Status</p>
              <p className="text-sm text-gray-600">
                {isConfigured ? 'URL configured in environment' : 'Not configured'}
              </p>
            </div>
            <Badge variant={isConfigured ? 'default' : 'secondary'}>
              {isConfigured ? 'Ready' : 'Setup Required'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={testConnection} variant="outline">
            Test Connection
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/yourusername/yourrepo/blob/main/GOOGLE_SHEETS_SETUP.md" target="_blank" rel="noopener noreferrer">
              Setup Guide
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
