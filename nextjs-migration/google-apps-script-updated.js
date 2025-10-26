function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Helper function to format dates in Indian format (DD/MM/YYYY)
    function formatDateIndian(dateString) {
      if (!dateString) return '';
      var date = new Date(dateString);
      var day = ('0' + date.getDate()).slice(-2);
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var year = date.getFullYear();
      return day + '/' + month + '/' + year;
    }
    
    // Helper function to get Indian timestamp
    function getIndianTimestamp() {
      var date = new Date();
      // Convert to IST (UTC + 5:30)
      var istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      var istDate = new Date(date.getTime() + istOffset);
      
      var day = ('0' + istDate.getDate()).slice(-2);
      var month = ('0' + (istDate.getMonth() + 1)).slice(-2);
      var year = istDate.getFullYear();
      var hours = ('0' + istDate.getHours()).slice(-2);
      var minutes = ('0' + istDate.getMinutes()).slice(-2);
      var seconds = ('0' + istDate.getSeconds()).slice(-2);
      
      return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    
    // Handle status update
    if (data.action === 'updateStatus') {
      var studentId = data.studentId;
      var status = data.status;
      
      // Find the row with matching student ID (assuming row number = studentId)
      var targetRow = studentId + 1; // +1 because row 1 is header
      
      // Update status in column (Application Status column - adjusted for new fields)
      sheet.getRange(targetRow, 48).setValue(status); // Updated column index
      
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Status updated successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Handle form submission
    // Check if sheet is empty and add headers
    if (sheet.getLastRow() === 0) {
      var headers = [
        'Timestamp', 'Student Name', 'First Name', 'Middle Name', 'Last Name', 
        'Gender', 'Photo', 'Age', 'Date of Birth', 'Aadhar Number', 'Village', 'Disability',
        'Current Education', 'Current Year', 'School Name', 'Other Education', 'Future Plans',
        'Year 1 Class', 'Year 1 Marks', 'Year 2 Class', 'Year 2 Marks', 'Year 3 Class', 'Year 3 Marks',
        'Achievements', 'Tuition Fees', 'Books Cost', 'Stationery Cost', 'Travel Cost',
        'Uniform Cost', 'Exam Fees', 'Hostel Fees', 'Other Expenses', 'Total Expenses',
        'Father Name', 'Mother Name', 'Father Age', 'Father Occupation', 'Father Income',
        'Family Yearly Income', 'Total Family Members', 'Earning Members',
        'Education Expense Bearer', 'Phone Number', 'Alternate Phone', 'Email', 
        'Address', 'Pincode', 'Application Status'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      
      // Set photo column width to accommodate images
      sheet.setColumnWidth(7, 120); // Photo column (now column 7)
      
      // Set gender column width to prevent overlap
      sheet.setColumnWidth(6, 100); // Gender column
    }
    
    var rowData = [
      data.timestamp ? getIndianTimestamp() : getIndianTimestamp(),
      data.studentName || '',
      data.firstName || '',
      data.middleName || '',
      data.lastName || '',
      data.gender || '',
      '', // Photo placeholder
      data.age ? Number(data.age) : '',
      data.dateOfBirth ? formatDateIndian(data.dateOfBirth) : '',
      data.aadharNumber || '',
      data.villageName || '',
      data.disability || '',
      data.currentEducation || '',
      data.currentYear || '',
      data.schoolName || '',
      data.otherEducation || '',
      data.futurePlans || '',
      data.year1Class || '',
      data.year1Marks || '',
      data.year2Class || '',
      data.year2Marks || '',
      data.year3Class || '',
      data.year3Marks || '',
      data.achievements || '',
      data.tuitionFees ? Number(data.tuitionFees) : 0,
      data.booksCost ? Number(data.booksCost) : 0,
      data.stationeryCost ? Number(data.stationeryCost) : 0,
      data.travelCost ? Number(data.travelCost) : 0,
      data.uniformCost ? Number(data.uniformCost) : 0,
      data.examFees ? Number(data.examFees) : 0,
      data.hostelFees ? Number(data.hostelFees) : 0,
      data.otherExpenses ? Number(data.otherExpenses) : 0,
      data.totalExpenses ? Number(data.totalExpenses) : 0,
      data.fatherName || '',
      data.motherName || '',
      data.fatherAge ? Number(data.fatherAge) : '',
      data.fatherOccupation || '',
      data.fatherIncome ? Number(data.fatherIncome) : 0,
      data.familyYearlyIncome ? Number(data.familyYearlyIncome) : 0,
      data.totalFamilyMembers ? Number(data.totalFamilyMembers) : 0,
      data.earningMembers ? Number(data.earningMembers) : 0,
      data.educationExpenseBearer || '',
      data.phoneNumber || '',
      data.alternatePhone || '',
      data.email || '',
      data.address || '',
      data.pincode || '',
      'pending' // Default status for new submissions
    ];
    
    sheet.appendRow(rowData);
    
    // Format numeric columns to prevent date interpretation
    var currentRow = sheet.getLastRow();
    
    // Set number format for Age column (column 8)
    sheet.getRange(currentRow, 8).setNumberFormat('0');
    
    // Set number format for Father Age column (column 36)
    sheet.getRange(currentRow, 36).setNumberFormat('0');
    
    // Set number format for all expense/income columns (columns 25-33, 38-41)
    var expenseColumns = [25, 26, 27, 28, 29, 30, 31, 32, 33]; // Expense columns
    var familyColumns = [38, 39, 40, 41]; // Income and family member columns
    
    expenseColumns.forEach(function(col) {
      sheet.getRange(currentRow, col).setNumberFormat('#,##0');
    });
    
    familyColumns.forEach(function(col) {
      sheet.getRange(currentRow, col).setNumberFormat('0');
    });
    
    // Insert photo if provided
    if (data.photo && data.photo.startsWith('data:image/')) {
      try {
        var currentRow = sheet.getLastRow();
        var base64Data = data.photo.split(',')[1];
        var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/png', 'student_photo.png');
        // Column 7 is Photo (1-based index for insertImage)
        var image = sheet.insertImage(blob, 7, currentRow);
        image.setWidth(100);
        image.setHeight(100);
        // Set image to anchor to column 7 specifically
        image.assignScript(''); // Clear any scripts
        sheet.setRowHeight(currentRow, 110);
        // Ensure the image is in column 7 by setting the range
        var photoCell = sheet.getRange(currentRow, 7);
        photoCell.setValue(''); // Clear the cell to ensure image displays properly
      } catch (imageError) {
        console.log('Error inserting image: ' + imageError.toString());
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data and image added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
