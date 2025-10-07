import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    
    if (!GOOGLE_SCRIPT_URL) {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_GOOGLE_SCRIPT_URL not configured in .env.local'
      }, { status: 400 })
    }

    const testData = {
      timestamp: new Date().toISOString(),
      studentName: 'Test Student',
      age: 18,
      dateOfBirth: '2006-01-01',
      villageName: 'Test Village',
      disability: 'None',
      currentEducation: 'undergraduate',
      currentYear: '1st Year',
      schoolName: 'Test College',
      otherEducation: '',
      futurePlans: 'This is a test submission to verify Google Sheets connection',
      year1Class: '',
      year1Marks: '',
      year2Class: '',
      year2Marks: '',
      year3Class: '',
      year3Marks: '',
      achievements: 'Test Achievement',
      tuitionFees: 10000,
      booksCost: 2000,
      stationeryCost: 500,
      travelCost: 1000,
      uniformCost: 1500,
      examFees: 500,
      hostelFees: 0,
      otherExpenses: 0,
      totalExpenses: 15500,
      fatherName: 'Test Father',
      fatherAge: 45,
      fatherOccupation: 'Farmer',
      fatherIncome: 50000,
      familyYearlyIncome: 50000,
      totalFamilyMembers: 4,
      earningMembers: 1,
      educationExpenseBearer: 'Father',
      phoneNumber: '9999999999',
      address: 'Test Address, Test City, Test State - 123456'
    }

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    return NextResponse.json({
      success: true,
      message: 'Test data sent to Google Sheets. Check your sheet for a new row with "Test Student".',
      url: GOOGLE_SCRIPT_URL,
      testData: testData
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
