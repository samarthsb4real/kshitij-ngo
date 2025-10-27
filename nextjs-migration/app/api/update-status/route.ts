import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, requirePermission } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser()
    if (!requirePermission(user, 'canUpdateStatus')) {
      return NextResponse.json(
        { error: 'Unauthorized. You do not have permission to update status.' },
        { status: 403 }
      )
    }

    const { studentId, status } = await request.json()

    // Update status in Google Sheets via Apps Script
    const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '', {
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