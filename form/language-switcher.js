// Language translations and switcher functionality

const translations = {
    en: {
        // Header
        'form-title': 'Student Sponsorship Application Form',
        'form-subtitle': 'Please fill out all required fields to apply for sponsorship',
        'language-label': 'Language:',
        
        // Section titles
        'personal-info-title': 'Personal Information',
        'education-info-title': 'Education Information',
        'academic-performance-title': 'Academic Performance',
        'expenses-title': 'Education Expense Breakdown',
        'family-info-title': 'Family Information',
        'contact-info-title': 'Contact Information',
        
        // Personal Information
        'name-label': 'Full Name *',
        'dob-label': 'Date of Birth *',
        'age-label': 'Age *',
        'village-label': 'Village Name *',
        'disability-label': 'Any Disability',
        'no-disability': 'No',
        'physical-disability': 'Physical',
        'visual-disability': 'Visual',
        'hearing-disability': 'Hearing',
        'intellectual-disability': 'Intellectual',
        'other-disability': 'Other',
        
        // Education Information
        'current-edu-label': 'Current Education Level *',
        'select-education': 'Select Education Level',
        'primary-edu': 'Primary School',
        'secondary-edu': 'Secondary School',
        'higher-secondary-edu': 'Higher Secondary',
        'undergraduate-edu': 'Undergraduate',
        'postgraduate-edu': 'Postgraduate',
        'diploma-edu': 'Diploma',
        'vocational-edu': 'Vocational Training',
        'year-label': 'Current Year/Class *',
        'school-label': 'School/College Name *',
        'other-edu-label': 'Other Education/Courses',
        'future-plans-label': 'Future Study Plans *',
        
        // Academic Performance
        'marks-title': 'Marks for Last 3 Academic Years',
        'year1-title': 'Most Recent Year',
        'year2-title': 'Second Recent Year',
        'year3-title': 'Third Recent Year',
        'year1-class-label': 'Class/Year',
        'year1-marks-label': 'Marks/Percentage',
        'year2-class-label': 'Class/Year',
        'year2-marks-label': 'Marks/Percentage',
        'year3-class-label': 'Class/Year',
        'year3-marks-label': 'Marks/Percentage',
        'achievements-label': 'Achievements and Awards',
        
        // Expenses
        'tuition-label': 'Tuition Fees (₹/year) *',
        'books-label': 'Books and Study Material (₹/year) *',
        'stationery-label': 'Stationery (₹/year) *',
        'travel-label': 'Travel/Transportation (₹/year) *',
        'uniform-label': 'Uniform and Clothing (₹/year)',
        'exam-label': 'Exam Fees (₹/year)',
        'hostel-label': 'Hostel/Accommodation (₹/year)',
        'other-expenses-label': 'Other Expenses (₹/year)',
        'total-expenses-label': 'Total Annual Education Expenses (₹)',
        
        // Family Information
        'father-name-label': 'Father\'s Name *',
        'father-age-label': 'Father\'s Age *',
        'father-occupation-label': 'Father\'s Occupation *',
        'father-income-label': 'Father\'s Annual Income (₹) *',
        'family-income-label': 'Total Family Annual Income (₹) *',
        'total-members-label': 'Total Family Members *',
        'earning-members-label': 'Earning Members in Family *',
        'expense-bearer-label': 'Who Currently Bears Education Expenses? *',
        'current-funder-label': 'Who is Currently Funding Child\'s Education?',
        'funder-income-label': 'Current Funder\'s Annual Income (₹)',
        
        // Contact Information
        'phone-label': 'Phone Number *',
        'address-label': 'Complete Address *',
        
        // Buttons
        'submit-btn': 'Submit Application',
        'reset-btn': 'Reset Form'
    },
    
    hi: {
        // Header
        'form-title': 'छात्र प्रायोजन आवेदन फॉर्म',
        'form-subtitle': 'कृपया प्रायोजन के लिए आवेदन करने हेतु सभी आवश्यक फील्ड भरें',
        'language-label': 'भाषा:',
        
        // Section titles
        'personal-info-title': 'व्यक्तिगत जानकारी',
        'education-info-title': 'शिक्षा संबंधी जानकारी',
        'academic-performance-title': 'शैक्षणिक प्रदर्शन',
        'expenses-title': 'शिक्षा व्यय विवरण',
        'family-info-title': 'पारिवारिक जानकारी',
        'contact-info-title': 'संपर्क जानकारी',
        
        // Personal Information
        'name-label': 'पूरा नाम *',
        'dob-label': 'जन्म तिथि *',
        'age-label': 'आयु *',
        'village-label': 'गांव का नाम *',
        'disability-label': 'कोई अपंगता',
        'no-disability': 'नहीं',
        'physical-disability': 'शारीरिक',
        'visual-disability': 'दृष्टि संबंधी',
        'hearing-disability': 'श्रवण संबंधी',
        'intellectual-disability': 'बौद्धिक',
        'other-disability': 'अन्य',
        
        // Education Information
        'current-edu-label': 'वर्तमान शिक्षा स्तर *',
        'select-education': 'शिक्षा स्तर चुनें',
        'primary-edu': 'प्राथमिक विद्यालय',
        'secondary-edu': 'माध्यमिक विद्यालय',
        'higher-secondary-edu': 'उच्च माध्यमिक',
        'undergraduate-edu': 'स्नातक',
        'postgraduate-edu': 'स्नातकोत्तर',
        'diploma-edu': 'डिप्लोमा',
        'vocational-edu': 'व्यावसायिक प्रशिक्षण',
        'year-label': 'वर्तमान वर्ष/कक्षा *',
        'school-label': 'स्कूल/कॉलेज का नाम *',
        'other-edu-label': 'अन्य शिक्षा/कोर्स',
        'future-plans-label': 'भविष्य की अध्ययन योजनाएं *',
        
        // Academic Performance
        'marks-title': 'पिछले 3 शैक्षणिक वर्षों के अंक',
        'year1-title': 'सबसे हाल का वर्ष',
        'year2-title': 'दूसरा हाल का वर्ष',
        'year3-title': 'तीसरा हाल का वर्ष',
        'year1-class-label': 'कक्षा/वर्ष',
        'year1-marks-label': 'अंक/प्रतिशत',
        'year2-class-label': 'कक्षा/वर्ष',
        'year2-marks-label': 'अंक/प्रतिशत',
        'year3-class-label': 'कक्षा/वर्ष',
        'year3-marks-label': 'अंक/प्रतिशत',
        'achievements-label': 'उपलब्धियां और पुरस्कार',
        
        // Expenses
        'tuition-label': 'ट्यूशन फीस (₹/वर्ष) *',
        'books-label': 'किताबें और अध्ययन सामग्री (₹/वर्ष) *',
        'stationery-label': 'स्टेशनरी (₹/वर्ष) *',
        'travel-label': 'यात्रा/परिवहन (₹/वर्ष) *',
        'uniform-label': 'यूनिफॉर्म और कपड़े (₹/वर्ष)',
        'exam-label': 'परीक्षा फीस (₹/वर्ष)',
        'hostel-label': 'छात्रावास/आवास (₹/वर्ष)',
        'other-expenses-label': 'अन्य व्यय (₹/वर्ष)',
        'total-expenses-label': 'कुल वार्षिक शिक्षा व्यय (₹)',
        
        // Family Information
        'father-name-label': 'पिता का नाम *',
        'father-age-label': 'पिता की आयु *',
        'father-occupation-label': 'पिता का व्यवसाय *',
        'father-income-label': 'पिता की वार्षिक आय (₹) *',
        'family-income-label': 'कुल पारिवारिक वार्षिक आय (₹) *',
        'total-members-label': 'कुल पारिवारिक सदस्य *',
        'earning-members-label': 'परिवार में कमाने वाले सदस्य *',
        'expense-bearer-label': 'वर्तमान में शिक्षा का खर्च कौन उठाता है? *',
        'current-funder-label': 'वर्तमान में बच्चे की शिक्षा कौन फंड कर रहा है?',
        'funder-income-label': 'वर्तमान फंडर की वार्षिक आय (₹)',
        
        // Contact Information
        'phone-label': 'फोन नंबर *',
        'address-label': 'पूरा पता *',
        
        // Buttons
        'submit-btn': 'आवेदन जमा करें',
        'reset-btn': 'फॉर्म रीसेट करें'
    },
    
    mr: {
        // Header
        'form-title': 'विद्यार्थी प्रायोजन अर्जाचा फॉर्म',
        'form-subtitle': 'कृपया प्रायोजनासाठी अर्ज करण्यासाठी सर्व आवश्यक फील्ड भरा',
        'language-label': 'भाषा:',
        
        // Section titles
        'personal-info-title': 'वैयक्तिक माहिती',
        'education-info-title': 'शिक्षण संबंधी माहिती',
        'academic-performance-title': 'शैक्षणिक कामगिरी',
        'expenses-title': 'शिक्षण खर्चाचा तपशील',
        'family-info-title': 'कौटुंबिक माहिती',
        'contact-info-title': 'संपर्क माहिती',
        
        // Personal Information
        'name-label': 'पूर्ण नाव *',
        'dob-label': 'जन्म तारीख *',
        'age-label': 'वय *',
        'village-label': 'गावाचे नाव *',
        'disability-label': 'कोणतीही अपंगता',
        'no-disability': 'नाही',
        'physical-disability': 'शारीरिक',
        'visual-disability': 'दृष्टी संबंधी',
        'hearing-disability': 'श्रवण संबंधी',
        'intellectual-disability': 'बौद्धिक',
        'other-disability': 'इतर',
        
        // Education Information
        'current-edu-label': 'सध्याचा शिक्षण स्तर *',
        'select-education': 'शिक्षण स्तर निवडा',
        'primary-edu': 'प्राथमिक शाळा',
        'secondary-edu': 'माध्यमिक शाळा',
        'higher-secondary-edu': 'उच्च माध्यमिक',
        'undergraduate-edu': 'पदवी',
        'postgraduate-edu': 'पदव्युत्तर',
        'diploma-edu': 'डिप्लोमा',
        'vocational-edu': 'व्यावसायिक प्रशिक्षण',
        'year-label': 'सध्याचे वर्ष/वर्ग *',
        'school-label': 'शाळा/महाविद्यालयाचे नाव *',
        'other-edu-label': 'इतर शिक्षण/अभ्यासक्रम',
        'future-plans-label': 'भविष्यातील अभ्यासाची योजना *',
        
        // Academic Performance
        'marks-title': 'गेल्या 3 शैक्षणिक वर्षांचे गुण',
        'year1-title': 'सर्वात अलीकडचे वर्ष',
        'year2-title': 'दुसरे अलीकडचे वर्ष',
        'year3-title': 'तिसरे अलीकडचे वर्ष',
        'year1-class-label': 'वर्ग/वर्ष',
        'year1-marks-label': 'गुण/टक्केवारी',
        'year2-class-label': 'वर्ग/वर्ष',
        'year2-marks-label': 'गुण/टक्केवारी',
        'year3-class-label': 'वर्ग/वर्ष',
        'year3-marks-label': 'गुण/टक्केवारी',
        'achievements-label': 'यश आणि पुरस्कार',
        
        // Expenses
        'tuition-label': 'शिकवणी फी (₹/वर्ष) *',
        'books-label': 'पुस्तके आणि अभ्यास साहित्य (₹/वर्ष) *',
        'stationery-label': 'स्टेशनरी (₹/वर्ष) *',
        'travel-label': 'प्रवास/वाहतूक (₹/वर्ष) *',
        'uniform-label': 'गणवेश आणि कपडे (₹/वर्ष)',
        'exam-label': 'परीक्षा फी (₹/वर्ष)',
        'hostel-label': 'वसतिगृह/निवास (₹/वर्ष)',
        'other-expenses-label': 'इतर खर्च (₹/वर्ष)',
        'total-expenses-label': 'एकूण वार्षिक शिक्षण खर्च (₹)',
        
        // Family Information
        'father-name-label': 'वडिलांचे नाव *',
        'father-age-label': 'वडिलांचे वय *',
        'father-occupation-label': 'वडिलांचा व्यवसाय *',
        'father-income-label': 'वडिलांचे वार्षिक उत्पन्न (₹) *',
        'family-income-label': 'एकूण कौटुंबिक वार्षिक उत्पन्न (₹) *',
        'total-members-label': 'एकूण कौटुंबिक सदस्य *',
        'earning-members-label': 'कुटुंबातील कमावणारे सदस्य *',
        'expense-bearer-label': 'सध्या शिक्षणाचा खर्च कोण उचलतो? *',
        'current-funder-label': 'सध्या मुलाच्या शिक्षणाला कोण फंड करत आहे?',
        'funder-income-label': 'सध्याच्या फंडरचे वार्षिक उत्पन्न (₹)',
        
        // Contact Information
        'phone-label': 'फोन नंबर *',
        'address-label': 'पूर्ण पत्ता *',
        
        // Buttons
        'submit-btn': 'अर्ज सबमिट करा',
        'reset-btn': 'फॉर्म रीसेट करा'
    }
};

// Current language
let currentLanguage = 'en';

// Function to change language
function changeLanguage() {
    const languageSelect = document.getElementById('language-select');
    currentLanguage = languageSelect.value;
    
    // Update all text elements
    updateTextContent();
    
    // Update document language attribute
    document.documentElement.lang = currentLanguage;
    
    // Save language preference
    localStorage.setItem('selectedLanguage', currentLanguage);
}

// Function to update text content based on selected language
function updateTextContent() {
    const currentTranslations = translations[currentLanguage];
    
    // Update all elements with IDs that have translations
    for (const [id, text] of Object.entries(currentTranslations)) {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = text;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        }
    }
    
    // Update placeholders if needed
    updatePlaceholders();
}

// Function to update placeholders based on language
function updatePlaceholders() {
    const placeholders = {
        en: {
            'student-name': 'Enter full name',
            'village-name': 'Enter village name',
            'current-year': 'e.g., 12th, 2nd Year B.A.',
            'school-name': 'Enter school/college name',
            'other-education': 'Any additional courses or certifications',
            'future-plans': 'Describe your academic goals and career aspirations',
            'achievements': 'List any awards, competitions won, or notable achievements',
            'father-name': 'Enter father\'s full name',
            'father-occupation': 'e.g., Farmer, Teacher, Business',
            'education-expense-bearer': 'e.g., Father, Mother, Self, Relative',
            'current-funder': 'e.g., Parents, Scholarship, Loan',
            'phone-number': '10-digit mobile number',
            'address': 'Complete postal address with pin code'
        },
        hi: {
            'student-name': 'पूरा नाम दर्ज करें',
            'village-name': 'गांव का नाम दर्ज करें',
            'current-year': 'जैसे: 12वीं, द्वितीय वर्ष बी.ए.',
            'school-name': 'स्कूल/कॉलेज का नाम दर्ज करें',
            'other-education': 'कोई अतिरिक्त कोर्स या प्रमाण पत्र',
            'future-plans': 'अपने शैक्षणिक लक्ष्यों और करियर की आकांक्षाओं का वर्णन करें',
            'achievements': 'कोई पुरस्कार, प्रतियोगिता जीत, या उल्लेखनीय उपलब्धियों की सूची',
            'father-name': 'पिता का पूरा नाम दर्ज करें',
            'father-occupation': 'जैसे: किसान, शिक्षक, व्यापार',
            'education-expense-bearer': 'जैसे: पिता, माता, स्वयं, रिश्तेदार',
            'current-funder': 'जैसे: माता-पिता, छात्रवृत्ति, ऋण',
            'phone-number': '10 अंकों का मोबाइल नंबर',
            'address': 'पिन कोड के साथ पूरा डाक पता'
        },
        mr: {
            'student-name': 'पूर्ण नाव टाका',
            'village-name': 'गावाचे नाव टाका',
            'current-year': 'उदा: 12वी, द्वितीय वर्ष बी.ए.',
            'school-name': 'शाळा/महाविद्यालयाचे नाव टाका',
            'other-education': 'कोणतेही अतिरिक्त अभ्यासक्रम किंवा प्रमाणपत्रे',
            'future-plans': 'तुमची शैक्षणिक उद्दिष्टे आणि करिअरची आकांक्षा वर्णन करा',
            'achievements': 'कोणतेही पुरस्कार, स्पर्धा जिंकलेली किंवा उल्लेखनीय यशांची यादी',
            'father-name': 'वडिलांचे पूर्ण नाव टाका',
            'father-occupation': 'उदा: शेतकरी, शिक्षक, व्यवसाय',
            'education-expense-bearer': 'उदा: वडील, आई, स्वतः, नातेवाईक',
            'current-funder': 'उदा: पालक, शिष्यवृत्ती, कर्ज',
            'phone-number': '10 अंकी मोबाइल नंबर',
            'address': 'पिन कोडसह पूर्ण टपाल पत्ता'
        }
    };
    
    const currentPlaceholders = placeholders[currentLanguage];
    if (currentPlaceholders) {
        for (const [id, placeholder] of Object.entries(currentPlaceholders)) {
            const element = document.getElementById(id);
            if (element) {
                element.placeholder = placeholder;
            }
        }
    }
}

// Function to load saved language preference
function loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        document.getElementById('language-select').value = savedLanguage;
        updateTextContent();
    }
}

// Initialize language functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language preference
    loadLanguagePreference();
    
    // Set up language change event listener
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', changeLanguage);
    }
    
    // Update text content for initial load
    updateTextContent();
});

// Function to get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Export functions for use in other scripts
window.changeLanguage = changeLanguage;
window.getCurrentLanguage = getCurrentLanguage;
