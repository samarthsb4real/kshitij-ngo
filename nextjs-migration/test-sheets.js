const { google } = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

// Test Google Sheets connection
async function testConnection() {
  try {
    // Hardcoded credentials - replace with actual values
    const privateKey = `e3a7d6117f994c33e898c8ece70c7e44144463f0`
    
    const clientEmail = "ngo-sheets-service@kshitijngo.iam.gserviceaccount.com "
    const spreadsheetId = "1ABC123XYZ456_YOUR_ACTUAL_SPREADSHEET_ID"

    const auth = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      SCOPES
    )

    const sheets = google.sheets({ version: 'v4', auth })

    // Test connection
    console.log('Testing Google Sheets connection...')
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    
    console.log('✅ Connection successful!')
    console.log('Spreadsheet title:', spreadsheet.data.properties?.title)
    console.log('Available sheets:', spreadsheet.data.sheets?.map(s => s.properties?.title))

    // Test writing data
    console.log('\nTesting data submission...')
    const testData = [
      new Date().toISOString(),
      'Test Student',
      20,
      '2003-01-01',
      'Test Village',
      'None',
      'Test Education',
      '12th',
      'Test School',
      'Test Plans',
      5000, 2000, 1000, 500, 1000, 500, 0, 0, 10000,
      'Test Father',
      45,
      'Farmer',
      25000,
      30000,
      4,
      1,
      'Parents',
      '9876543210',
      'Test Address'
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Form Submissions!A:AC',
      valueInputOption: 'RAW',
      requestBody: {
        values: [testData]
      }
    })

    console.log('✅ Test data submitted successfully!')

  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testConnection()