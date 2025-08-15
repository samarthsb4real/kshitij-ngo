// Form validation and functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sponsorship-form');
    const dateOfBirthInput = document.getElementById('date-of-birth');
    const ageInput = document.getElementById('age');
    const expenseInputs = document.querySelectorAll('[id$="-cost"], [id$="-fees"], #other-expenses');
    const totalExpensesInput = document.getElementById('total-expenses');
    const earningMembersInput = document.getElementById('earning-members');
    const totalMembersInput = document.getElementById('total-family-members');

    // Age calculation based on date of birth
    dateOfBirthInput.addEventListener('change', function() {
        const dob = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        ageInput.value = age;
        
        // Validate age (must be 21 or under)
        if (age > 21) {
            showError('age-error', 'Age must be 21 or under to be eligible for sponsorship');
            ageInput.classList.add('error');
        } else if (age < 1) {
            showError('age-error', 'Please enter a valid date of birth');
            ageInput.classList.add('error');
        } else {
            clearError('age-error');
            ageInput.classList.remove('error');
        }
    });

    // Real-time expense calculation
    expenseInputs.forEach(input => {
        input.addEventListener('input', calculateTotalExpenses);
    });

    function calculateTotalExpenses() {
        let total = 0;
        expenseInputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            total += value;
        });
        totalExpensesInput.value = total;
    }

    // Validate earning members vs total members
    function validateFamilyMembers() {
        const totalMembers = parseInt(totalMembersInput.value) || 0;
        const earningMembers = parseInt(earningMembersInput.value) || 0;
        
        if (earningMembers > totalMembers) {
            showError('earning-members-error', 'Earning members cannot exceed total family members');
            return false;
        } else {
            clearError('earning-members-error');
            return true;
        }
    }

    totalMembersInput.addEventListener('input', validateFamilyMembers);
    earningMembersInput.addEventListener('input', validateFamilyMembers);

    // Form validation functions
    function validateRequired(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        if (!value) {
            showError(errorId, message);
            field.classList.add('error');
            return false;
        } else {
            clearError(errorId);
            field.classList.remove('error');
            return true;
        }
    }

    function validateName(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const namePattern = /^[a-zA-Z\s]+$/;
        
        if (!value) {
            showError(errorId, 'This field is required');
            field.classList.add('error');
            return false;
        } else if (!namePattern.test(value)) {
            showError(errorId, 'Please enter a valid name (letters and spaces only)');
            field.classList.add('error');
            return false;
        } else {
            clearError(errorId);
            field.classList.remove('error');
            return true;
        }
    }

    function validatePhone(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const phonePattern = /^[6-9]\d{9}$/;
        
        if (!value) {
            showError(errorId, 'Phone number is required');
            field.classList.add('error');
            return false;
        } else if (!phonePattern.test(value)) {
            showError(errorId, 'Please enter a valid 10-digit Indian mobile number');
            field.classList.add('error');
            return false;
        } else {
            clearError(errorId);
            field.classList.remove('error');
            return true;
        }
    }

    function validateEmail(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value && !emailPattern.test(value)) {
            showError(errorId, 'Please enter a valid email address');
            field.classList.add('error');
            return false;
        } else {
            clearError(errorId);
            field.classList.remove('error');
            return true;
        }
    }

    function validateAge() {
        const age = parseInt(ageInput.value);
        if (!age || age < 1 || age > 21) {
            showError('age-error', 'Age must be between 1 and 21 years');
            return false;
        }
        clearError('age-error');
        return true;
    }

    function validateNumberField(fieldId, errorId, min = 0, message = 'Please enter a valid amount') {
        const field = document.getElementById(fieldId);
        const value = parseFloat(field.value);
        
        if (field.hasAttribute('required') && (!value && value !== 0)) {
            showError(errorId, 'This field is required');
            field.classList.add('error');
            return false;
        } else if (value < min) {
            showError(errorId, `Value must be at least ${min}`);
            field.classList.add('error');
            return false;
        } else {
            clearError(errorId);
            field.classList.remove('error');
            return true;
        }
    }

    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Real-time validation for specific fields
    document.getElementById('student-name').addEventListener('blur', () => validateName('student-name', 'name-error'));
    document.getElementById('village-name').addEventListener('blur', () => validateRequired('village-name', 'village-error', 'Village name is required'));
    document.getElementById('current-education').addEventListener('change', () => validateRequired('current-education', 'current-edu-error', 'Please select current education level'));
    document.getElementById('current-year').addEventListener('blur', () => validateRequired('current-year', 'year-error', 'Current year/class is required'));
    document.getElementById('school-name').addEventListener('blur', () => validateRequired('school-name', 'school-error', 'School/College name is required'));
    document.getElementById('future-plans').addEventListener('blur', () => validateRequired('future-plans', 'future-plans-error', 'Please describe your future study plans'));
    
    // Expense field validations
    document.getElementById('tuition-fees').addEventListener('blur', () => validateNumberField('tuition-fees', 'tuition-error', 0, 'Please enter a valid tuition amount'));
    document.getElementById('books-cost').addEventListener('blur', () => validateNumberField('books-cost', 'books-error', 0, 'Please enter a valid books cost'));
    document.getElementById('stationery-cost').addEventListener('blur', () => validateNumberField('stationery-cost', 'stationery-error', 0, 'Please enter a valid stationery cost'));
    document.getElementById('travel-cost').addEventListener('blur', () => validateNumberField('travel-cost', 'travel-error', 0, 'Please enter a valid travel cost'));
    
    // Family information validations
    document.getElementById('father-name').addEventListener('blur', () => validateName('father-name', 'father-name-error'));
    document.getElementById('father-age').addEventListener('blur', () => validateNumberField('father-age', 'father-age-error', 18, 'Father\'s age must be at least 18'));
    document.getElementById('father-occupation').addEventListener('blur', () => validateRequired('father-occupation', 'father-occupation-error', 'Father\'s occupation is required'));
    document.getElementById('father-income').addEventListener('blur', () => validateNumberField('father-income', 'father-income-error', 0, 'Please enter a valid income'));
    document.getElementById('family-yearly-income').addEventListener('blur', () => validateNumberField('family-yearly-income', 'family-income-error', 0, 'Please enter valid family income'));
    document.getElementById('total-family-members').addEventListener('blur', () => validateNumberField('total-family-members', 'total-members-error', 1, 'Total family members must be at least 1'));
    document.getElementById('earning-members').addEventListener('blur', () => validateNumberField('earning-members', 'earning-members-error', 0, 'Please enter number of earning members'));
    document.getElementById('education-expense-bearer').addEventListener('blur', () => validateRequired('education-expense-bearer', 'expense-bearer-error', 'Please specify who bears education expenses'));
    
    // Contact validations
    document.getElementById('phone-number').addEventListener('blur', () => validatePhone('phone-number', 'phone-error'));
    document.getElementById('address').addEventListener('blur', () => validateRequired('address', 'address-error', 'Complete address is required'));

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        
        // Personal information
        isValid &= validateName('student-name', 'name-error');
        isValid &= validateRequired('date-of-birth', 'dob-error', 'Date of birth is required');
        isValid &= validateAge();
        isValid &= validateRequired('village-name', 'village-error', 'Village name is required');
        
        // Education information
        isValid &= validateRequired('current-education', 'current-edu-error', 'Please select current education level');
        isValid &= validateRequired('current-year', 'year-error', 'Current year/class is required');
        isValid &= validateRequired('school-name', 'school-error', 'School/College name is required');
        isValid &= validateRequired('future-plans', 'future-plans-error', 'Please describe your future study plans');
        
        // Expense validation
        isValid &= validateNumberField('tuition-fees', 'tuition-error', 0);
        isValid &= validateNumberField('books-cost', 'books-error', 0);
        isValid &= validateNumberField('stationery-cost', 'stationery-error', 0);
        isValid &= validateNumberField('travel-cost', 'travel-error', 0);
        
        // Family information
        isValid &= validateName('father-name', 'father-name-error');
        isValid &= validateNumberField('father-age', 'father-age-error', 18);
        isValid &= validateRequired('father-occupation', 'father-occupation-error', 'Father\'s occupation is required');
        isValid &= validateNumberField('father-income', 'father-income-error', 0);
        isValid &= validateNumberField('family-yearly-income', 'family-income-error', 0);
        isValid &= validateNumberField('total-family-members', 'total-members-error', 1);
        isValid &= validateNumberField('earning-members', 'earning-members-error', 0);
        isValid &= validateRequired('education-expense-bearer', 'expense-bearer-error', 'Please specify who bears education expenses');
        isValid &= validateFamilyMembers();
        
        // Contact information
        isValid &= validatePhone('phone-number', 'phone-error');
        isValid &= validateRequired('address', 'address-error', 'Complete address is required');
        
        if (isValid) {
            // Show success message
            showSuccessMessage();
            
            // Here you would typically send the data to a server
            console.log('Form submitted successfully!');
            
            // Optionally reset the form
            // form.reset();
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Application submitted successfully! We will review your application and contact you soon.';
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Scroll to top
        successDiv.scrollIntoView({ behavior: 'smooth' });
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Reset form functionality
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', function() {
        // Clear all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Remove error classes
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        // Reset total expenses
        totalExpensesInput.value = '';
    });
});

// Auto-save functionality (optional)
function autoSave() {
    const formData = new FormData(document.getElementById('sponsorship-form'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('sponsorship-form-data', JSON.stringify(data));
}

// Load saved data on page load
function loadSavedData() {
    const savedData = localStorage.getItem('sponsorship-form-data');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        for (let [key, value] of Object.entries(data)) {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = value;
            }
        }
    }
}

// Auto-save every 30 seconds
setInterval(autoSave, 30000);

// Load saved data when page loads
document.addEventListener('DOMContentLoaded', loadSavedData);
