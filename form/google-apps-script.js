// Google Apps Script Code for Handling Form Submissions
// This code should be deployed as a Web App in Google Apps Script

// SETUP INSTRUCTIONS:
// 1. Go to script.google.com
// 2. Create a new project
// 3. Replace the default code with this script
// 4. Create a new Google Sheet and note its ID from the URL
// 5. Replace SHEET_ID below with your actual sheet ID
// 6. Deploy as Web App with permissions for anyone to access
// 7. Copy the Web App URL and paste it in sheets-integration.js

const SHEET_ID = '1yBGfTEz1Q1TBsAkaMXyifp_YNLZZhSTW1bhmxMGFlvY'; // Replace with your actual Google Sheet ID
const SHEET_NAME = 'Form Submissions'; // Name of the sheet tab

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = saveToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(data) {
  try {
    const sheet = getOrCreateSheet();
    
    // Prepare the row data in the correct order
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.submissionId || '',
      
      // Personal Information
      data.studentName || '',
      data.dateOfBirth || '',
      data.age || '',
      data.villageName || '',
      data.disability || '',
      
      // Education Information
      data.currentEducation || '',
      data.currentYear || '',
      data.schoolName || '',
      data.otherEducation || '',
      data.futurePlans || '',
      
      // Academic Performance
      data.year1Class || '',
      data.year1Marks || '',
      data.year2Class || '',
      data.year2Marks || '',
      data.year3Class || '',
      data.year3Marks || '',
      data.achievements || '',
      
      // Expenses
      data.tuitionFees || '',
      data.booksCost || '',
      data.stationeryCost || '',
      data.travelCost || '',
      data.uniformCost || '',
      data.examFees || '',
      data.hostelFees || '',
      data.otherExpenses || '',
      data.totalExpenses || '',
      
      // Family Information
      data.fatherName || '',
      data.fatherAge || '',
      data.fatherOccupation || '',
      data.fatherIncome || '',
      data.familyYearlyIncome || '',
      data.totalFamilyMembers || '',
      data.earningMembers || '',
      data.educationExpenseBearer || '',
      data.currentFunder || '',
      data.funderIncome || '',
      
      // Contact Information
      data.phoneNumber || '',
      data.address || ''
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Send email notification (optional)
    sendNotificationEmail(data);
    
    return {
      success: true,
      message: 'Form submitted successfully',
      submissionId: data.submissionId
    };
    
  } catch (error) {
    console.error('Error saving to sheet:', error);
    throw new Error('Failed to save data to Google Sheets: ' + error.toString());
  }
}

function getOrCreateSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupSheetHeaders(sheet);
    }
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }
    
    return sheet;
    
  } catch (error) {
    console.error('Error accessing sheet:', error);
    throw new Error('Could not access Google Sheet. Please check the SHEET_ID.');
  }
}

function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Submission ID',
    
    // Personal Information
    'Student Name',
    'Date of Birth',
    'Age',
    'Village Name',
    'Disability',
    
    // Education Information
    'Current Education Level',
    'Current Year/Class',
    'School/College Name',
    'Other Education/Courses',
    'Future Study Plans',
    
    // Academic Performance
    'Year 1 Class',
    'Year 1 Marks',
    'Year 2 Class',
    'Year 2 Marks',
    'Year 3 Class',
    'Year 3 Marks',
    'Achievements',
    
    // Expenses
    'Tuition Fees',
    'Books Cost',
    'Stationery Cost',
    'Travel Cost',
    'Uniform Cost',
    'Exam Fees',
    'Hostel Fees',
    'Other Expenses',
    'Total Expenses',
    
    // Family Information
    'Father Name',
    'Father Age',
    'Father Occupation',
    'Father Income',
    'Family Yearly Income',
    'Total Family Members',
    'Earning Members',
    'Education Expense Bearer',
    'Current Funder',
    'Funder Income',
    
    // Contact Information
    'Phone Number',
    'Address'
  ];
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  
  // Freeze the header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

function sendNotificationEmail(data) {
  try {
    // Replace with your email address
    const recipientEmail = 'samarthbhadane23@gmail.com';
    
    if (!recipientEmail || recipientEmail === 'samarthbhadane23@gmail.com') {
      console.log('Email notification skipped - no recipient email configured');
      return;
    }
    
    const subject = `New Sponsorship Application: ${data.studentName}`;
    
    const emailBody = `
      A new sponsorship application has been submitted.
      
      Student Details:
      - Name: ${data.studentName}
      - Age: ${data.age}
      - Village: ${data.villageName}
      - Education Level: ${data.currentEducation}
      - School: ${data.schoolName}
      
      Family Details:
      - Father: ${data.fatherName}
      - Father's Occupation: ${data.fatherOccupation}
      - Family Income: ₹${data.familyYearlyIncome}
      - Family Members: ${data.totalFamilyMembers}
      
      Contact:
      - Phone: ${data.phoneNumber}
      - Address: ${data.address}
      
      Total Education Expenses: ₹${data.totalExpenses}
      
      Submission ID: ${data.submissionId}
      Submitted at: ${data.timestamp}
      
      Please review the complete application in the Google Sheet.
    `;
    
    MailApp.sendEmail(recipientEmail, subject, emailBody);
    console.log('Notification email sent successfully');
    
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw error here - email failure shouldn't stop form submission
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput('Google Apps Script is running. Use POST requests to submit form data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test function to verify setup
function testSetup() {
  try {
    const sheet = getOrCreateSheet();
    console.log('Sheet setup successful');
    console.log('Sheet name:', sheet.getName());
    console.log('Headers row count:', sheet.getLastRow());
    
    return 'Setup test completed successfully';
  } catch (error) {
    console.error('Setup test failed:', error);
    return 'Setup test failed: ' + error.toString();
  }
}
