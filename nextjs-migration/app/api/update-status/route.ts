import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { studentId, status } = await request.json()

    // Update status in Google Sheets via Apps Script
    const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzM-7XZh4ehhpPv7yFnVsiDUj6u6wlMx0OEw3yimjdG9eYaxPV_XjnYQ1Qm6F5QzGLo/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'updateStatus',
        studentId: parseInt(studentId),
        status
      })
    })

    const result = await response.json()

    if (result.status === 'success') {
      return NextResponse.json({ success: true })
    } else {
      throw new Error(result.message || 'Failed to update status')
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}