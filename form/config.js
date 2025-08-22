// Production Configuration for Sponsorship Form
// This file contains all configuration settings for the form

const CONFIG = {
    // Google Sheets Integration
    googleSheets: {
        scriptURL: 'https://script.google.com/macros/s/AKfycbx11sEMlGtdW6WK-x2lrRL261rhFhl9-4OB5ZUBDOe-Lvkbhe_HaUN0--GtatF5loZw/exec',
        sheetId: '1yBGfTEz1Q1TBsAkaMXyifp_YNLZZhSTW1bhmxMGFlvY',
        enabled: true
    },
    
    // Email Configuration
    email: {
        recipientEmail: 'samarthbhadane23@gmail.com',
        notificationEnabled: true,
        emailJSConfig: {
            serviceID: 'YOUR_EMAILJS_SERVICE_ID',
            templateID: 'YOUR_EMAILJS_TEMPLATE_ID',
            userID: 'YOUR_EMAILJS_USER_ID'
        }
    },
    
    // Form Validation Rules
    validation: {
        minAge: 1,
        maxAge: 21,
        phonePattern: /^[0-9]{10}$/,
        requiredFields: [
            'studentName', 'dateOfBirth', 'age', 'villageName', 'currentEducation',
            'currentYear', 'schoolName', 'futurePlans', 'tuitionFees', 'booksCost',
            'stationeryCost', 'travelCost', 'fatherName', 'fatherAge', 'fatherOccupation',
            'fatherIncome', 'familyYearlyIncome', 'totalFamilyMembers', 'earningMembers',
            'educationExpenseBearer', 'phoneNumber', 'address'
        ]
    },
    
    // UI Settings
    ui: {
        defaultLanguage: 'en',
        autoSaveEnabled: true,
        autoSaveInterval: 30000, // 30 seconds
        showProgressIndicator: true,
        enablePrintMode: true
    },
    
    // Security Settings
    security: {
        enableCSRFProtection: false, // Set to true in production with proper token
        sanitizeInputs: true,
        maxSubmissionsPerHour: 5,
        enableRateLimiting: true
    },
    
    // Development/Debug Settings
    debug: {
        enabled: false, // Set to false in production
        logLevel: 'error', // 'debug', 'info', 'warn', 'error'
        mockSubmissions: false
    }
};

// Utility functions for configuration
const ConfigUtils = {
    isProduction: () => window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    getConfig: (path) => {
        return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
    },
    
    updateConfig: (path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], CONFIG);
        target[lastKey] = value;
    },
    
    validateConfig: () => {
        const errors = [];
        
        // Check Google Sheets configuration
        if (CONFIG.googleSheets.enabled) {
            if (!CONFIG.googleSheets.scriptURL || CONFIG.googleSheets.scriptURL.includes('YOUR_')) {
                errors.push('Google Sheets script URL not configured');
            }
        }
        
        // Check email configuration
        if (CONFIG.email.notificationEnabled) {
            if (!CONFIG.email.recipientEmail || CONFIG.email.recipientEmail.includes('your-')) {
                errors.push('Email recipient not configured');
            }
        }
        
        return errors;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ConfigUtils };
} else {
    window.CONFIG = CONFIG;
    window.ConfigUtils = ConfigUtils;
}
