import { NextRequest, NextResponse } from 'next/server'
import { submitToGoogleSheets } from '@/lib/google-sheets-form'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Basic validation for required fields
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: firstName, lastName, and phoneNumber are mandatory' },
        { status: 400 }
      )
    }

    // Transform form data for Google Sheets submission
    const submissionData = {
      studentName: `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim(),
      firstName: formData.firstName,
      middleName: formData.middleName || '',
      lastName: formData.lastName,
      photo: formData.photo || '',
      age: formData.age || 0,
      dateOfBirth: formData.dateOfBirth,
      villageName: formData.villageName,
      disability: formData.disability || 'None',
      currentEducation: formData.currentEducation,
      currentYear: formData.currentEducation, // Add missing currentYear field
      schoolName: formData.schoolName,
      otherEducation: formData.otherEducation || '',
      futurePlans: formData.futurePlans,
      aadharNumber: formData.aadharNumber || '',
      gender: formData.gender || '',
      alternatePhone: formData.alternatePhone || '',
      email: formData.email || '',
      year1Class: formData.year1Class || '',
      year1Marks: formData.year1Marks?.toString() || '',
      year2Class: formData.year2Class || '',
      year2Marks: formData.year2Marks?.toString() || '',
      year3Class: formData.year3Class || '',
      year3Marks: formData.year3Marks?.toString() || '',
      achievements: formData.achievements || '',
      tuitionFees: formData.tuitionFees || 0,
      booksCost: formData.booksCost || 0,
      stationeryCost: formData.stationeryCost || 0,
      travelCost: formData.travelCost || 0,
      uniformCost: formData.uniformCost || 0,
      examFees: formData.examFees || 0,
      hostelFees: formData.hostelFees || 0,
      otherExpenses: formData.otherExpenses || 0,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      fatherAge: formData.fatherAge || 0,
      fatherOccupation: formData.fatherOccupation,
      fatherIncome: formData.fatherIncome || 0,
      familyYearlyIncome: formData.familyYearlyIncome || 0,
      totalFamilyMembers: formData.totalFamilyMembers || 0,
      earningMembers: formData.earningMembers || 0,
      educationExpenseBearer: formData.educationExpenseBearer,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      pincode: formData.pincode || ''
    }

    // Submit to Google Sheets (Apps Script) and capture result
    const result = await submitToGoogleSheets(submissionData)

    if (!result || !result.success) {
      console.error('Google Sheets submission failed:', result?.error || 'unknown')
      return NextResponse.json(
        { success: false, error: `Failed to submit to Google Sheets: ${result?.error || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Log successful submission
    console.log('Form submission successful:', {
      studentName: submissionData.studentName,
      phone: submissionData.phoneNumber,
      age: submissionData.age,
      education: submissionData.currentEducation,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Sponsorship application submitted successfully',
      submissionId: `SPONS_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`
    })

  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    )
  }
}