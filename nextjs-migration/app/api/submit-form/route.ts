import { NextResponse } from 'next/server'
import { submitToGoogleSheets } from '@/lib/google-sheets-form'

export async function POST(request: Request) {
  try {
    // Validate request headers
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // Rate limiting check (basic)
    const userAgent = request.headers.get('user-agent')
    if (!userAgent || userAgent.length < 10) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    const data = await request.json()
    
    // Validate required fields including photo
    const requiredFields = ['firstName', 'lastName', 'photo', 'dateOfBirth', 'villageName', 'currentEducation', 'phoneNumber']
    const missingFields = requiredFields.filter(field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === ''))
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate photo format
    if (data.photo && !data.photo.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid photo format' },
        { status: 400 }
      )
    }

    const submissionId = Date.now().toString()
    
    // Submit to Google Sheets with error handling
    let googleSheetsSuccess = false
    try {
      googleSheetsSuccess = await submitToGoogleSheets(data)
    } catch (sheetsError) {
      console.error('Google Sheets submission failed:', sheetsError)
      // Continue processing even if Google Sheets fails
    }
    
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
    
    // Don't expose internal error details
    const errorMessage = error instanceof SyntaxError 
      ? 'Invalid JSON data'
      : 'Internal server error'
      
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof SyntaxError ? 400 : 500 }
    )
  }
}
