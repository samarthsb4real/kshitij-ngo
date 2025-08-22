// Alternative Google Forms Integration
// This approach submits data to a Google Form, which automatically saves to Google Sheets

class GoogleFormsIntegration {
    constructor() {
        // Replace with your Google Form URL (get from "Send" -> "Link")
        this.formURL = 'YOUR_GOOGLE_FORM_URL_HERE';
        this.form = document.getElementById('sponsorship-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.init();
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
            await this.submitToGoogleForm(formData);
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
        const data = {};
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    async submitToGoogleForm(data) {
        // Create a hidden iframe to submit to Google Form
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'hidden_iframe';
        document.body.appendChild(iframe);

        // Create a temporary form that submits to Google Forms
        const tempForm = document.createElement('form');
        tempForm.target = 'hidden_iframe';
        tempForm.method = 'POST';
        tempForm.action = this.formURL.replace('/viewform', '/formResponse');

        // Map your form fields to Google Form entry IDs
        const fieldMapping = {
            // You'll need to get these entry IDs from your Google Form
            'studentName': 'entry.123456789',
            'age': 'entry.987654321',
            'villageName': 'entry.456789123',
            // Add more mappings as needed
        };

        // Add fields to the temporary form
        Object.keys(data).forEach(key => {
            if (fieldMapping[key]) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = fieldMapping[key];
                input.value = data[key];
                tempForm.appendChild(input);
            }
        });

        document.body.appendChild(tempForm);
        tempForm.submit();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(tempForm);
            document.body.removeChild(iframe);
        }, 1000);
    }

    validateForm() {
        // Same validation logic as before
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
        this.showNotification('Application submitted successfully! We will review your application and contact you soon.', 'success');
    }

    showErrorMessage(message) {
        this.showNotification('Error submitting application: ' + message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GoogleFormsIntegration();
});
