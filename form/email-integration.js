// Alternative Email Integration
// This approach sends form data via email using EmailJS service

class EmailIntegration {
    constructor() {
        // EmailJS configuration (free service)
        this.emailJSConfig = {
            serviceID: 'YOUR_EMAILJS_SERVICE_ID',
            templateID: 'YOUR_EMAILJS_TEMPLATE_ID',
            userID: 'YOUR_EMAILJS_USER_ID'
        };
        
        this.form = document.getElementById('sponsorship-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.loadEmailJS();
        this.init();
    }

    loadEmailJS() {
        // Load EmailJS library
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init(this.emailJSConfig.userID);
        };
        document.head.appendChild(script);
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupExpenseCalculation();
            this.setupAgeCalculation();
        }
    }

    setupExpenseCalculation() {
        const expenseFields = [
            'tuition-fees', 'books-cost', 'stationery-cost', 'travel-cost',
            'uniform-cost', 'exam-fees', 'hostel-fees', 'other-expenses'
        ];
        
        expenseFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.calculateTotalExpenses());
            }
        });
    }

    setupAgeCalculation() {
        const dobField = document.getElementById('date-of-birth');
        const ageField = document.getElementById('age');
        
        if (dobField && ageField) {
            dobField.addEventListener('change', () => {
                const birthDate = new Date(dobField.value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                
                ageField.value = age > 0 ? age : '';
            });
        }
    }

    calculateTotalExpenses() {
        const expenseFields = [
            'tuition-fees', 'books-cost', 'stationery-cost', 'travel-cost',
            'uniform-cost', 'exam-fees', 'hostel-fees', 'other-expenses'
        ];
        
        let total = 0;
        expenseFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value) {
                total += parseFloat(field.value) || 0;
            }
        });
        
        const totalField = document.getElementById('total-expenses');
        if (totalField) {
            totalField.value = total;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        this.setSubmitState(true);
        
        try {
            const formData = this.collectFormData();
            await this.sendEmail(formData);
            
            // Also save to local storage as backup
            this.saveToLocalStorage(formData);
            
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            console.error('Submission error:', error);
            this.showErrorMessage(error.message);
        } finally {
            this.setSubmitState(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            timestamp: new Date().toISOString(),
            submissionId: this.generateSubmissionId()
        };
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    async sendEmail(data) {
        if (!window.emailjs) {
            throw new Error('EmailJS not loaded. Please check your internet connection.');
        }

        // Format data for email template
        const emailData = {
            to_email: 'your-ngo-email@gmail.com', // Replace with your email
            student_name: data.studentName,
            student_age: data.age,
            village: data.villageName,
            phone: data.phoneNumber,
            education_level: data.currentEducation,
            school_name: data.schoolName,
            father_name: data.fatherName,
            father_occupation: data.fatherOccupation,
            family_income: data.familyYearlyIncome,
            total_expenses: data.totalExpenses,
            submission_id: data.submissionId,
            timestamp: data.timestamp,
            // Add a formatted summary
            form_data: this.formatDataForEmail(data)
        };

        const response = await emailjs.send(
            this.emailJSConfig.serviceID,
            this.emailJSConfig.templateID,
            emailData
        );

        if (response.status !== 200) {
            throw new Error('Failed to send email');
        }
    }

    formatDataForEmail(data) {
        return `
STUDENT SPONSORSHIP APPLICATION

Personal Information:
- Name: ${data.studentName}
- Age: ${data.age}
- Village: ${data.villageName}
- Disability: ${data.disability || 'None'}

Education:
- Current Level: ${data.currentEducation}
- Year/Class: ${data.currentYear}
- School: ${data.schoolName}
- Future Plans: ${data.futurePlans}

Family Information:
- Father: ${data.fatherName} (${data.fatherAge} years)
- Occupation: ${data.fatherOccupation}
- Father's Income: ₹${data.fatherIncome}
- Family Income: ₹${data.familyYearlyIncome}
- Family Members: ${data.totalFamilyMembers}
- Earning Members: ${data.earningMembers}

Expenses:
- Tuition: ₹${data.tuitionFees}
- Books: ₹${data.booksCost}
- Stationery: ₹${data.stationeryCost}
- Travel: ₹${data.travelCost}
- Total: ₹${data.totalExpenses}

Contact:
- Phone: ${data.phoneNumber}
- Address: ${data.address}

Submission ID: ${data.submissionId}
Submitted: ${data.timestamp}
        `;
    }

    saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem('ngoSubmissions') || '[]');
            submissions.push(data);
            localStorage.setItem('ngoSubmissions', JSON.stringify(submissions));
        } catch (error) {
            console.error('Failed to save to local storage:', error);
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }

    setSubmitState(isSubmitting) {
        this.submitBtn.disabled = isSubmitting;
        this.submitBtn.textContent = isSubmitting ? 'Submitting...' : 'Submit Application';
    }

    showSuccessMessage() {
        this.showNotification('Application submitted successfully! You will receive a confirmation email shortly.', 'success');
    }

    showErrorMessage(message) {
        this.showNotification('Error submitting application: ' + message, 'error');
    }

    showNotification(message, type) {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.insertBefore(notification, document.body.firstChild);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    generateSubmissionId() {
        return 'SUB_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailIntegration();
});
