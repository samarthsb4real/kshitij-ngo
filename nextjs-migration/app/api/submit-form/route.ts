import { NextResponse } from 'next/server'
import { submitToGoogleSheets } from '@/lib/google-sheets-form'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const submissionId = Date.now().toString()
    
    // Submit to Google Sheets
    const googleSheetsSuccess = await submitToGoogleSheets(data)
    
    return NextResponse.json({
      success: true,
      submissionId,
      googleSheetsSuccess,
      message: googleSheetsSuccess 
        ? 'Form submitted to Google Sheets successfully'
        : 'Form submission processed (Google Sheets may be unavailable)'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
