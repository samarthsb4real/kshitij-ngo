import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

// Initialize Google Sheets API
const getGoogleSheetsInstance = () => {
  // Hardcoded credentials for testing
  const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8Q2E7l1wJxvF5
YOUR_ACTUAL_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----`
  const clientEmail = "ngo-service@your-project.iam.gserviceaccount.com"

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES
  })

  return google.sheets({ version: 'v4', auth })
}

export interface FormSubmissionRow {
  timestamp: string
  studentName: string
  age: number
  dateOfBirth: string
  villageName: string
  disability: string
  currentEducation: string
  currentYear: string
  schoolName: string
  futurePlans: string
  tuitionFees: number
  booksCost: number
  stationeryCost: number
  travelCost: number
  uniformCost: number
  examFees: number
  hostelFees: number
  otherExpenses: number
  totalExpenses: number
  fatherName: string
  fatherAge: number
  fatherOccupation: string
  fatherIncome: number
  familyYearlyIncome: number
  totalFamilyMembers: number
  earningMembers: number
  educationExpenseBearer: string
  phoneNumber: string
  address: string
}

// Submit form data to Google Sheets
export const submitToGoogleSheets = async (formData: FormSubmissionRow) => {
  try {
    const sheets = getGoogleSheetsInstance()
    const spreadsheetId = "1ABC123XYZ456_YOUR_ACTUAL_SPREADSHEET_ID"
    const sheetName = 'Form Submissions'

    // Prepare row data
    const rowData = [
      formData.timestamp,
      formData.studentName,
      formData.age,
      formData.dateOfBirth,
      formData.villageName,
      formData.disability || 'None',
      formData.currentEducation,
      formData.currentYear,
      formData.schoolName,
      formData.futurePlans,
      formData.tuitionFees,
      formData.booksCost,
      formData.stationeryCost,
      formData.travelCost,
      formData.uniformCost || 0,
      formData.examFees || 0,
      formData.hostelFees || 0,
      formData.otherExpenses || 0,
      formData.totalExpenses,
      formData.fatherName,
      formData.fatherAge,
      formData.fatherOccupation,
      formData.fatherIncome,
      formData.familyYearlyIncome,
      formData.totalFamilyMembers,
      formData.earningMembers,
      formData.educationExpenseBearer,
      formData.phoneNumber,
      formData.address
    ]

    // Check if sheet exists and has headers
    await ensureSheetHeaders(sheets, spreadsheetId, sheetName)

    // Append the row
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:AC`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData]
      }
    })

    return {
      success: true,
      updatedRange: response.data.updates?.updatedRange,
      updatedRows: response.data.updates?.updatedRows
    }
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error)
    throw error
  }
}

// Ensure sheet has proper headers
const ensureSheetHeaders = async (sheets: any, spreadsheetId: string, sheetName: string) => {
  try {
    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const sheet = spreadsheet.data.sheets?.find((s: any) => s.properties.title === sheetName)

    if (!sheet) {
      // Create sheet if it doesn't exist
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }]
        }
      })
    }

    // Check if headers exist
    const headerRange = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:AC1`
    })

    if (!headerRange.data.values || headerRange.data.values.length === 0) {
      // Add headers
      const headers = [
        'Timestamp', 'Student Name', 'Age', 'Date of Birth', 'Village Name', 'Disability',
        'Current Education', 'Current Year', 'School Name', 'Future Plans',
        'Tuition Fees', 'Books Cost', 'Stationery Cost', 'Travel Cost', 'Uniform Cost',
        'Exam Fees', 'Hostel Fees', 'Other Expenses', 'Total Expenses',
        'Father Name', 'Father Age', 'Father Occupation', 'Father Income',
        'Family Yearly Income', 'Total Family Members', 'Earning Members',
        'Education Expense Bearer', 'Phone Number', 'Address'
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:AC1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers]
        }
      })
    }
  } catch (error) {
    console.error('Error ensuring sheet headers:', error)
    throw error
  }
}

// Read form submissions from Google Sheets
export const getFormSubmissions = async () => {
  try {
    const sheets = getGoogleSheetsInstance()
    const spreadsheetId = "1ABC123XYZ456_YOUR_ACTUAL_SPREADSHEET_ID"
    const sheetName = 'Form Submissions'

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:AC`
    })

    const rows = response.data.values
    if (!rows || rows.length <= 1) {
      return []
    }

    // Skip header row and convert to objects
    const submissions = rows.slice(1).map((row: any[]) => ({
      timestamp: row[0] || '',
      studentName: row[1] || '',
      age: parseInt(row[2]) || 0,
      dateOfBirth: row[3] || '',
      villageName: row[4] || '',
      disability: row[5] || 'None',
      currentEducation: row[6] || '',
      currentYear: row[7] || '',
      schoolName: row[8] || '',
      futurePlans: row[9] || '',
      tuitionFees: parseFloat(row[10]) || 0,
      booksCost: parseFloat(row[11]) || 0,
      stationeryCost: parseFloat(row[12]) || 0,
      travelCost: parseFloat(row[13]) || 0,
      uniformCost: parseFloat(row[14]) || 0,
      examFees: parseFloat(row[15]) || 0,
      hostelFees: parseFloat(row[16]) || 0,
      otherExpenses: parseFloat(row[17]) || 0,
      totalExpenses: parseFloat(row[18]) || 0,
      fatherName: row[19] || '',
      fatherAge: parseInt(row[20]) || 0,
      fatherOccupation: row[21] || '',
      fatherIncome: parseFloat(row[22]) || 0,
      familyYearlyIncome: parseFloat(row[23]) || 0,
      totalFamilyMembers: parseInt(row[24]) || 0,
      earningMembers: parseInt(row[25]) || 0,
      educationExpenseBearer: row[26] || '',
      phoneNumber: row[27] || '',
      address: row[28] || ''
    }))

    return submissions
  } catch (error) {
    console.error('Error reading from Google Sheets:', error)
    throw error
  }
}

// Test Google Sheets connection
export const testGoogleSheetsConnection = async () => {
  try {
    const sheets = getGoogleSheetsInstance()
    const spreadsheetId = "1ABC123XYZ456_YOUR_ACTUAL_SPREADSHEET_ID"

    const response = await sheets.spreadsheets.get({ spreadsheetId })
    return {
      success: true,
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map(sheet => sheet.properties?.title)
    }
  } catch (error) {
    console.error('Google Sheets connection test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}