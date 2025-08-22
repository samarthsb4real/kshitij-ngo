# Google Sheets Integration Setup Guide

This guide will walk you through setting up your sponsorship form to save data directly to Google Sheets.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" → "Blank spreadsheet"
3. Name your spreadsheet (e.g., "NGO Sponsorship Applications")
4. Copy the Google Sheet ID from the URL
   - Example URL: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Sheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 2: Set up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js`
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
6. Optionally, replace `your-email@gmail.com` with your email for notifications

## Step 3: Deploy the Web App

1. Click "Deploy" → "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Fill in the deployment settings:
   - Description: "Sponsorship Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Authorize the necessary permissions
6. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/ABC123.../exec`)

## Step 4: Update the Form Configuration

1. Open `sheets-integration.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL
3. Save the file

## Step 5: Test the Setup

1. Open your `sponsorship-form.html` in a web browser
2. Fill out and submit the form
3. Check your Google Sheet - you should see the submission data

## File Structure

Your form directory should now contain:
- `sponsorship-form.html` - Main form
- `form-styles.css` - Form styling
- `sheets-integration.js` - Google Sheets integration
- `form-validation.js` - Form validation and progress tracking
- `language-switcher.js` - Multi-language support
- `google-apps-script.js` - Backend code for Google Apps Script

## Features Included

### 📊 **Google Sheets Integration**
- Automatic data saving to Google Sheets
- Structured data organization with proper headers
- Unique submission IDs for tracking

### ✅ **Form Validation**
- Real-time field validation
- Required field checking
- Data format validation (phone, email, numbers)
- Cross-field validation (family members, income consistency)

### 📈 **Progress Tracking**
- Visual progress indicator
- Section completion status
- Overall completion percentage

### 📧 **Email Notifications**
- Automatic email alerts on new submissions
- Detailed application summary
- Configurable recipient

### 🌐 **Multi-language Support**
- English, Hindi, and Marathi
- Easy language switching
- Preserved form state across language changes

### 📱 **Responsive Design**
- Mobile-friendly layout
- Touch-optimized form elements
- Print-friendly styles

### 🔧 **Additional Features**
- Auto-calculation of total expenses
- Age calculation from birth date
- Form reset functionality
- Success/error notifications
- Data validation and error handling

## Customization Options

### Adding More Languages
Edit the `language-switcher.js` file to add more language translations.

### Changing Email Notifications
Modify the `sendNotificationEmail` function in the Google Apps Script.

### Adding Form Fields
1. Add the field to the HTML form
2. Update the JavaScript validation if needed
3. Add the field to the Google Apps Script headers and data processing

### Styling Changes
Modify `form-styles.css` to change colors, fonts, and layout.

## Troubleshooting

### Form not submitting
- Check that the Web App URL is correctly set in `sheets-integration.js`
- Ensure the Google Apps Script is deployed with "Anyone" access
- Check browser console for JavaScript errors

### Data not appearing in sheets
- Verify the Google Sheet ID is correct
- Check that the Google Apps Script has permissions to access the sheet
- Look at the Apps Script execution logs for errors

### Email notifications not working
- Ensure you've replaced the placeholder email address
- Check that the Google Apps Script has Gmail permissions
- Verify the email address is correct

## Security Notes

- The Web App URL should be treated as sensitive information
- Consider implementing additional security measures for production use
- Regularly review the Google Apps Script permissions
- Monitor the Google Sheets for unauthorized access

## Support

If you encounter any issues:
1. Check the browser developer console for errors
2. Review the Google Apps Script execution logs
3. Verify all configuration steps have been completed
4. Test with a simple form submission first

Your sponsorship form is now ready to collect and organize applications efficiently!
