"use client"

import { createContext, useContext, ReactNode } from 'react'

interface LanguageContextType {
  language: string
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Personal Information
    'personal-info-title': 'Personal Information',
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
    'education-info-title': 'Education Information',
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
    'academic-performance-title': 'Academic Performance',
    'marks-title': 'Marks for Last 3 Academic Years',
    'achievements-label': 'Achievements and Awards',
    
    // Expenses
    'expenses-title': 'Education Expense Breakdown',
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
    'family-info-title': 'Family Information',
    'father-name-label': "Father's Name *",
    'mother-name-label': "Mother's Name *",
    'father-age-label': "Father's Age *",
    'father-occupation-label': "Father's Occupation *",
    'father-income-label': "Father's Annual Income (₹) *",
    'family-income-label': 'Total Family Annual Income (₹) *',
    'total-members-label': 'Total Family Members *',
    'earning-members-label': 'Earning Members in Family *',
    'expense-bearer-label': 'Who Currently Bears Education Expenses? *',
    
    // Contact Information
    'contact-info-title': 'Contact Information',
    'phone-label': 'Phone Number *',
    'address-label': 'Complete Address *',
    
    // Buttons
    'submit-btn': 'Submit Application',
    'reset-btn': 'Reset Form',
    'next-btn': 'Next Section',
    'prev-btn': 'Previous Section'
  },
  
  hi: {
    // Personal Information
    'personal-info-title': 'व्यक्तिगत जानकारी',
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
    'education-info-title': 'शिक्षा संबंधी जानकारी',
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
    'academic-performance-title': 'शैक्षणिक प्रदर्शन',
    'marks-title': 'पिछले 3 शैक्षणिक वर्षों के अंक',
    'achievements-label': 'उपलब्धियां और पुरस्कार',
    
    // Expenses
    'expenses-title': 'शिक्षा व्यय विवरण',
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
    'family-info-title': 'पारिवारिक जानकारी',
    'father-name-label': 'पिता का नाम *',
    'mother-name-label': 'माता का नाम *',
    'father-age-label': 'पिता की आयु *',
    'father-occupation-label': 'पिता का व्यवसाय *',
    'father-income-label': 'पिता की वार्षिक आय (₹) *',
    'family-income-label': 'कुल पारिवारिक वार्षिक आय (₹) *',
    'total-members-label': 'कुल पारिवारिक सदस्य *',
    'earning-members-label': 'परिवार में कमाने वाले सदस्य *',
    'expense-bearer-label': 'वर्तमान में शिक्षा का खर्च कौन उठाता है? *',
    
    // Contact Information
    'contact-info-title': 'संपर्क जानकारी',
    'phone-label': 'फोन नंबर *',
    'address-label': 'पूरा पता *',
    
    // Buttons
    'submit-btn': 'आवेदन जमा करें',
    'reset-btn': 'फॉर्म रीसेट करें',
    'next-btn': 'अगला भाग',
    'prev-btn': 'पिछला भाग'
  },
  
  mr: {
    // Personal Information
    'personal-info-title': 'वैयक्तिक माहिती',
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
    'education-info-title': 'शिक्षण संबंधी माहिती',
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
    'academic-performance-title': 'शैक्षणिक कामगिरी',
    'marks-title': 'गेल्या 3 शैक्षणिक वर्षांचे गुण',
    'achievements-label': 'यश आणि पुरस्कार',
    
    // Expenses
    'expenses-title': 'शिक्षण खर्चाचा तपशील',
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
    'family-info-title': 'कौटुंबिक माहिती',
    'father-name-label': 'वडिलांचे नाव *',
    'mother-name-label': 'आईचे नाव *',
    'father-age-label': 'वडिलांचे वय *',
    'father-occupation-label': 'वडिलांचा व्यवसाय *',
    'father-income-label': 'वडिलांचे वार्षिक उत्पन्न (₹) *',
    'family-income-label': 'एकूण कौटुंबिक वार्षिक उत्पन्न (₹) *',
    'total-members-label': 'एकूण कौटुंबिक सदस्य *',
    'earning-members-label': 'कुटुंबातील कमावणारे सदस्य *',
    'expense-bearer-label': 'सध्या शिक्षणाचा खर्च कोण उचलतो? *',
    
    // Contact Information
    'contact-info-title': 'संपर्क माहिती',
    'phone-label': 'फोन नंबर *',
    'address-label': 'पूर्ण पत्ता *',
    
    // Buttons
    'submit-btn': 'अर्ज सबमिट करा',
    'reset-btn': 'फॉर्म रीसेट करा',
    'next-btn': 'पुढील भाग',
    'prev-btn': 'मागील भाग'
  }
}

interface LanguageProviderProps {
  language: string
  children: ReactNode
}

export function LanguageProvider({ language, children }: LanguageProviderProps) {
  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en
    return langTranslations[key as keyof typeof langTranslations] || key
  }

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}