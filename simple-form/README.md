# Simple Sponsorship Form - Setup Guide

This is a minimal, compact version of the sponsorship form with the simplest possible Google Sheets integration.

## ✨ Features

- **Single HTML file** - Everything in one place
- **Minimal code** - Easy to understand and modify
- **Auto-calculations** - Age and total cost calculated automatically
- **Responsive design** - Works on mobile and desktop
- **Clean UI** - Professional appearance
- **Simple validation** - Basic form validation

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Sponsorship Applications"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Setup Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `apps-script.js`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
5. Save the project (Ctrl+S)

### Step 3: Deploy the Script
1. Click **Deploy** → **New deployment**
2. Click the gear icon and select **Web app**
3. Set **Execute as**: "Me"
4. Set **Who has access**: "Anyone"
5. Click **Deploy**
6. Copy the Web App URL

### Step 4: Configure the Form
1. Open `index.html`
2. Find line with `YOUR_SCRIPT_ID` 
3. Replace the entire URL with your Web App URL
4. Save the file

### Step 5: Test
1. Open `index.html` in your browser
2. Fill out and submit the form
3. Check your Google Sheet for the data

## 📁 File Structure

```
simple-form/
├── index.html          # Complete form (HTML + CSS + JS)
├── apps-script.js      # Google Apps Script code
└── README.md          # This setup guide
```

## 🔧 Customization

### Add More Fields
To add a new field:

1. **In HTML**: Add the input field
```html
<div class="field">
    <label>New Field <span class="required">*</span></label>
    <input type="text" name="newField" required>
</div>
```

2. **In Apps Script**: Add the field to the headers and row data
```javascript
// Add to headers array:
'New Field'

// Add to row array:
data.newField || ''
```

### Change Styling
All CSS is in the `<style>` section of `index.html`. Modify colors, fonts, and layout as needed.

### Modify Validation
Add custom validation in the `handleSubmit` method before calling `submitToSheets`.

## 📊 Data Structure

The form collects these fields:
- **Personal**: Name, DOB, Age, Village
- **Education**: Level, Year, School, Future Plans
- **Financial**: Tuition Fees, Other Expenses, Total Cost
- **Family**: Father's Name, Occupation, Income, Family Size
- **Contact**: Phone, Address

## 🔍 Troubleshooting

### Form not submitting?
- Check browser console for errors
- Verify the Google Apps Script URL is correct
- Ensure the Apps Script is deployed with "Anyone" access

### Data not appearing in sheets?
- Check the Google Sheet ID in apps-script.js
- Verify the Apps Script has permission to access the sheet
- Look at Apps Script execution logs for errors

### Want to test without Google Sheets?
The form works in "demo mode" if you don't configure the URL. It will show success messages and log data to the browser console.

## 📈 Next Steps

Once basic setup is working:
- Add email notifications by modifying the Apps Script
- Add more validation rules
- Customize the styling
- Add multi-language support
- Set up automated responses

## 💡 Why This Approach?

**Pros:**
- ✅ Extremely simple setup
- ✅ Single file deployment
- ✅ No external dependencies
- ✅ Easy to understand and modify
- ✅ Works offline (demo mode)

**Cons:**
- ❌ Less feature-rich than the full version
- ❌ All code in one file (harder to maintain for large projects)
- ❌ Basic validation only

This simple version is perfect for getting started quickly or for small-scale applications!
