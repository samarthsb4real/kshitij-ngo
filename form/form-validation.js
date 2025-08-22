// Production-Grade Form Validation for Sponsorship Form
// Comprehensive validation with security, accessibility, and UX features

class FormValidator {
    constructor() {
        this.form = document.getElementById('sponsorship-form');
        this.errors = new Map();
        this.isSubmitting = false;
        this.autoSaveTimer = null;
        this.submissionAttempts = 0;
        this.maxAttempts = 3;
        
        this.init();
    }

    init() {
        if (!this.form) {
            console.error('Sponsorship form not found');
            return;
        }

        this.setupEventListeners();
        this.setupAutoSave();
        this.setupProgressTracking();
        this.loadSavedData();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Real-time validation on input
        this.form.addEventListener('input', (e) => this.handleInput(e));
        this.form.addEventListener('blur', (e) => this.handleBlur(e), true);
        this.form.addEventListener('change', (e) => this.handleChange(e));
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => this.handleReset(e));
        }
    }

    setupAutoSave() {
        if (!CONFIG?.ui?.autoSaveEnabled) return;
        
        const interval = CONFIG.ui.autoSaveInterval || 30000;
        this.autoSaveTimer = setInterval(() => {
            this.saveFormData();
        }, interval);
    }

    setupProgressTracking() {
        if (!CONFIG?.ui?.showProgressIndicator) return;
        
        this.createProgressIndicator();
        this.updateProgress();
    }

    setupAccessibility() {
        // Add ARIA labels and descriptions
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
            
            // Add asterisk to label if not present
            const label = this.form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.innerHTML += ' <span class="required-asterisk" aria-label="required">*</span>';
            }
        });
    }

    handleInput(e) {
        const field = e.target;
        if (!field.name) return;

        // Clear previous errors on input
        this.clearFieldError(field);
        
        // Special handling for specific fields
        switch (field.id) {
            case 'date-of-birth':
                this.calculateAge();
                break;
            case 'tuition-fees':
            case 'books-cost':
            case 'stationery-cost':
            case 'travel-cost':
            case 'uniform-cost':
            case 'exam-fees':
            case 'hostel-fees':
            case 'other-expenses':
                this.calculateTotalExpenses();
                break;
            case 'phone-number':
                this.formatPhoneNumber(field);
                break;
        }

        // Update progress
        this.updateProgress();
    }

    handleBlur(e) {
        const field = e.target;
        if (!field.name) return;

        // Validate field on blur
        this.validateField(field);
    }

    handleChange(e) {
        const field = e.target;
        if (!field.name) return;

        // Validate and update progress
        this.validateField(field);
        this.updateProgress();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        this.submissionAttempts++;
        
        if (this.submissionAttempts > this.maxAttempts) {
            this.showError('Maximum submission attempts exceeded. Please refresh the page.');
            return;
        }

        // Comprehensive validation
        if (!this.validateForm()) {
            this.showError('Please correct the errors below and try again.');
            return;
        }

        // Security checks
        if (!this.performSecurityChecks()) {
            this.showError('Security validation failed. Please try again.');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitState(true);

        try {
            const formData = this.collectFormData();
            
            // Submit to configured backends
            await this.submitForm(formData);
            
            this.showSuccess('Application submitted successfully! We will review your application and contact you soon.');
            this.clearSavedData();
            this.form.reset();
            this.updateProgress();
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError(`Submission failed: ${error.message}`);
        } finally {
            this.isSubmitting = false;
            this.setSubmitState(false);
        }
    }

    handleReset(e) {
        if (!confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
            e.preventDefault();
            return;
        }
        
        this.clearAllErrors();
        this.clearSavedData();
        this.updateProgress();
    }

    validateForm() {
        let isValid = true;
        this.errors.clear();

        // Validate required fields
        const requiredFields = CONFIG?.validation?.requiredFields || [];
        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });

        // Cross-field validation
        if (!this.validateCrossFields()) {
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        if (!field || !field.name) return true;

        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.setFieldError(field, 'This field is required');
            return false;
        }

        // Skip further validation if field is empty and not required
        if (!value && !field.hasAttribute('required')) {
            return true;
        }

        // Field-specific validation
        switch (fieldName) {
            case 'studentName':
            case 'fatherName':
                if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
                    this.setFieldError(field, 'Please enter a valid name (letters only)');
                    isValid = false;
                }
                break;

            case 'age':
                const age = parseInt(value);
                const minAge = CONFIG?.validation?.minAge || 1;
                const maxAge = CONFIG?.validation?.maxAge || 21;
                if (age < minAge || age > maxAge) {
                    this.setFieldError(field, `Age must be between ${minAge} and ${maxAge}`);
                    isValid = false;
                }
                break;

            case 'phoneNumber':
                const phonePattern = CONFIG?.validation?.phonePattern || /^[0-9]{10}$/;
                if (!phonePattern.test(value)) {
                    this.setFieldError(field, 'Please enter a valid 10-digit phone number');
                    isValid = false;
                }
                break;

            case 'fatherAge':
                const fatherAge = parseInt(value);
                if (fatherAge < 18 || fatherAge > 100) {
                    this.setFieldError(field, 'Please enter a valid age (18-100)');
                    isValid = false;
                }
                break;

            case 'fatherIncome':
            case 'familyYearlyIncome':
            case 'tuitionFees':
            case 'booksCost':
            case 'stationeryCost':
            case 'travelCost':
                const amount = parseFloat(value);
                if (amount < 0) {
                    this.setFieldError(field, 'Amount cannot be negative');
                    isValid = false;
                } else if (amount > 10000000) { // 1 crore limit
                    this.setFieldError(field, 'Amount seems too high, please verify');
                    isValid = false;
                }
                break;

            case 'totalFamilyMembers':
            case 'earningMembers':
                const count = parseInt(value);
                if (count < 1 || count > 50) {
                    this.setFieldError(field, 'Please enter a valid number (1-50)');
                    isValid = false;
                }
                break;

            case 'dateOfBirth':
                if (!this.validateDateOfBirth(value)) {
                    this.setFieldError(field, 'Please enter a valid date of birth');
                    isValid = false;
                }
                break;
        }

        if (isValid) {
            this.clearFieldError(field);
        }

        return isValid;
    }

    validateCrossFields() {
        let isValid = true;

        // Validate family members vs earning members
        const totalMembers = parseInt(this.getFieldValue('totalFamilyMembers')) || 0;
        const earningMembers = parseInt(this.getFieldValue('earningMembers')) || 0;
        
        if (earningMembers > totalMembers) {
            const earningField = this.form.querySelector('[name="earningMembers"]');
            this.setFieldError(earningField, 'Earning members cannot exceed total family members');
            isValid = false;
        }

        // Validate father's income vs family income
        const fatherIncome = parseFloat(this.getFieldValue('fatherIncome')) || 0;
        const familyIncome = parseFloat(this.getFieldValue('familyYearlyIncome')) || 0;
        
        if (fatherIncome > familyIncome) {
            const familyIncomeField = this.form.querySelector('[name="familyYearlyIncome"]');
            this.setFieldError(familyIncomeField, 'Family income cannot be less than father\'s income');
            isValid = false;
        }

        return isValid;
    }

    validateDateOfBirth(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        
        // Check if date is valid
        if (isNaN(date.getTime())) return false;
        
        // Check if date is not in the future
        if (date > today) return false;
        
        // Check if date is reasonable (not too old)
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(today.getFullYear() - 100);
        if (date < hundredYearsAgo) return false;
        
        return true;
    }

    performSecurityChecks() {
        if (!CONFIG?.security?.enableRateLimiting) return true;
        
        // Check submission rate limiting
        const submissions = JSON.parse(localStorage.getItem('submissionTimes') || '[]');
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const recentSubmissions = submissions.filter(time => time > oneHourAgo);
        
        const maxSubmissions = CONFIG.security.maxSubmissionsPerHour || 5;
        if (recentSubmissions.length >= maxSubmissions) {
            return false;
        }
        
        // Record this submission attempt
        recentSubmissions.push(Date.now());
        localStorage.setItem('submissionTimes', JSON.stringify(recentSubmissions));
        
        return true;
    }

    // Utility methods continue in next part...
    calculateAge() {
        const dobField = document.getElementById('date-of-birth');
        const ageField = document.getElementById('age');
        
        if (!dobField?.value || !ageField) return;
        
        const birthDate = new Date(dobField.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        ageField.value = age > 0 ? age : '';
        this.validateField(ageField);
    }

    calculateTotalExpenses() {
        const expenseFields = [
            'tuition-fees', 'books-cost', 'stationery-cost', 'travel-cost',
            'uniform-cost', 'exam-fees', 'hostel-fees', 'other-expenses'
        ];
        
        let total = 0;
        expenseFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field?.value) {
                total += parseFloat(field.value) || 0;
            }
        });
        
        const totalField = document.getElementById('total-expenses');
        if (totalField) {
            totalField.value = total;
        }
    }

    formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
        field.value = value;
    }

    setFieldError(field, message) {
        this.errors.set(field.name, message);
        
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.id + '-error');
    }

    clearFieldError(field) {
        this.errors.delete(field.name);
        
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    clearAllErrors() {
        this.errors.clear();
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
    }

    getFieldValue(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        return field ? field.value.trim() : '';
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            timestamp: new Date().toISOString(),
            submissionId: this.generateSubmissionId(),
            userAgent: navigator.userAgent,
            language: getCurrentLanguage?.() || 'en'
        };
        
        // Convert FormData to regular object with sanitization
        for (let [key, value] of formData.entries()) {
            data[key] = CONFIG?.security?.sanitizeInputs ? this.sanitizeInput(value) : value;
        }
        
        return data;
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Basic HTML sanitization
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    async submitForm(data) {
        const promises = [];
        
        // Submit to Google Sheets if enabled
        if (CONFIG?.googleSheets?.enabled && window.SheetsIntegration) {
            const sheetsIntegration = new window.SheetsIntegration();
            promises.push(sheetsIntegration.submitToSheets(data));
        }
        
        // Submit via email if enabled
        if (CONFIG?.email?.notificationEnabled && window.EmailIntegration) {
            const emailIntegration = new window.EmailIntegration();
            promises.push(emailIntegration.sendEmail(data));
        }
        
        // Wait for all submissions to complete
        const results = await Promise.allSettled(promises);
        
        // Check if at least one submission succeeded
        const hasSuccess = results.some(result => result.status === 'fulfilled');
        if (!hasSuccess) {
            throw new Error('All submission methods failed');
        }
    }

    setSubmitState(isSubmitting) {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = isSubmitting;
            submitBtn.textContent = isSubmitting ? 'Submitting...' : 'Submit Application';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" aria-label="Close notification">&times;</button>
        `;
        
        // Add to page
        document.body.insertBefore(notification, document.body.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    generateSubmissionId() {
        return 'SUB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Progress tracking methods
    createProgressIndicator() {
        const existingProgress = document.querySelector('.progress-container');
        if (existingProgress) return;
        
        const progressHTML = `
            <div class="progress-container">
                <div class="progress-header">
                    <h3>Form Progress</h3>
                    <span class="progress-percentage">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-sections">
                    <div class="section-progress" data-section="personal">Personal Info</div>
                    <div class="section-progress" data-section="education">Education</div>
                    <div class="section-progress" data-section="academic">Academic</div>
                    <div class="section-progress" data-section="expenses">Expenses</div>
                    <div class="section-progress" data-section="family">Family</div>
                    <div class="section-progress" data-section="contact">Contact</div>
                </div>
            </div>
        `;
        
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            formHeader.insertAdjacentHTML('afterend', progressHTML);
        }
    }

    updateProgress() {
        const progressContainer = document.querySelector('.progress-container');
        if (!progressContainer) return;
        
        const sections = {
            personal: ['studentName', 'dateOfBirth', 'age', 'villageName'],
            education: ['currentEducation', 'currentYear', 'schoolName', 'futurePlans'],
            academic: ['year1Class', 'year1Marks'],
            expenses: ['tuitionFees', 'booksCost', 'stationeryCost', 'travelCost'],
            family: ['fatherName', 'fatherAge', 'fatherOccupation', 'fatherIncome', 'familyYearlyIncome'],
            contact: ['phoneNumber', 'address']
        };
        
        let totalFields = 0;
        let completedFields = 0;
        
        Object.keys(sections).forEach(sectionName => {
            const fields = sections[sectionName];
            let sectionCompleted = 0;
            
            fields.forEach(fieldName => {
                totalFields++;
                const field = this.form.querySelector(`[name="${fieldName}"]`);
                if (field && field.value.trim()) {
                    completedFields++;
                    sectionCompleted++;
                }
            });
            
            // Update section indicator
            const sectionElement = progressContainer.querySelector(`[data-section="${sectionName}"]`);
            if (sectionElement) {
                const percentage = (sectionCompleted / fields.length) * 100;
                sectionElement.className = 'section-progress';
                if (percentage === 100) {
                    sectionElement.classList.add('completed');
                } else if (percentage > 0) {
                    sectionElement.classList.add('partial');
                }
            }
        });
        
        // Update overall progress
        const percentage = Math.round((completedFields / totalFields) * 100);
        const progressFill = progressContainer.querySelector('.progress-fill');
        const progressPercentage = progressContainer.querySelector('.progress-percentage');
        
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
    }

    // Auto-save functionality
    saveFormData() {
        if (!CONFIG?.ui?.autoSaveEnabled) return;
        
        try {
            const formData = new FormData(this.form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (value.trim()) {
                    data[key] = value;
                }
            }
            
            localStorage.setItem('ngoFormAutoSave', JSON.stringify({
                data,
                timestamp: Date.now(),
                language: getCurrentLanguage?.() || 'en'
            }));
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }

    loadSavedData() {
        if (!CONFIG?.ui?.autoSaveEnabled) return;
        
        try {
            const saved = localStorage.getItem('ngoFormAutoSave');
            if (!saved) return;
            
            const { data, timestamp } = JSON.parse(saved);
            
            // Don't load data older than 24 hours
            if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('ngoFormAutoSave');
                return;
            }
            
            // Ask user if they want to restore
            if (confirm('We found previously saved form data. Would you like to restore it?')) {
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = data[key];
                        // Trigger events to update calculations
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
                
                this.updateProgress();
            }
        } catch (error) {
            console.warn('Failed to load saved data:', error);
        }
    }

    clearSavedData() {
        localStorage.removeItem('ngoFormAutoSave');
    }

    // Cleanup method
    destroy() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for config to be available
    if (typeof CONFIG !== 'undefined') {
        window.formValidator = new FormValidator();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (typeof CONFIG !== 'undefined') {
                window.formValidator = new FormValidator();
            }
        }, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.formValidator) {
        window.formValidator.destroy();
    }
});