// Minimal Google Apps Script for Simple Sponsorship Form
// Copy this to script.google.com and deploy as Web App

const SHEET_ID = '1yBGfTEz1Q1TBsAkaMXyifp_YNLZZhSTW1bhmxMGFlvY';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(data) {
  const sheet = getSheet();
  
  // Complete row data - matches ALL form fields
  const row = [
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
  
  sheet.appendRow(row);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName('Applications');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Applications');
    
    // Add headers
    const headers = [
      'Timestamp', 'Submission ID', 
      
      // Personal Information
      'Student Name', 'Date of Birth', 'Age', 'Village Name', 'Disability',
      
      // Education Information
      'Current Education', 'Current Year', 'School Name', 'Other Education', 'Future Plans',
      
      // Academic Performance
      'Year 1 Class', 'Year 1 Marks', 'Year 2 Class', 'Year 2 Marks', 'Year 3 Class', 'Year 3 Marks', 'Achievements',
      
      // Expenses
      'Tuition Fees', 'Books Cost', 'Stationery Cost', 'Travel Cost', 'Uniform Cost', 'Exam Fees', 'Hostel Fees', 'Other Expenses', 'Total Expenses',
      
      // Family Information
      'Father Name', 'Father Age', 'Father Occupation', 'Father Income', 'Family Yearly Income', 'Total Family Members', 'Earning Members', 'Education Expense Bearer', 'Current Funder', 'Funder Income',
      
      // Contact Information
      'Phone Number', 'Address'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is running!');
}
