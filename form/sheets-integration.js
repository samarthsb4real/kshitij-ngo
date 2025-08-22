// Optimized Google Sheets Integration for Production
// Enhanced with retry logic, better error handling, and performance optimizations

class SheetsIntegration {
    constructor() {
        this.scriptURL = CONFIG?.googleSheets?.scriptURL || '';
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
        this.timeout = 30000; // 30 seconds
        this.isOnline = navigator.onLine;
        
        this.setupNetworkMonitoring();
    }

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processQueuedSubmissions();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    async submitToSheets(data) {
        // Validate configuration
        if (!this.scriptURL || this.scriptURL.includes('YOUR_')) {
            throw new Error('Google Sheets integration not configured. Please check your setup.');
        }

        // Check network connectivity
        if (!this.isOnline) {
            this.queueSubmission(data);
            throw new Error('No internet connection. Submission queued for when connection is restored.');
        }

        // Validate data
        this.validateSubmissionData(data);

        // Attempt submission with retry logic
        return await this.submitWithRetry(data);
    }

    validateSubmissionData(data) {
        const requiredFields = ['studentName', 'age', 'phoneNumber'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate data types and ranges
        if (data.age && (isNaN(data.age) || data.age < 1 || data.age > 21)) {
            throw new Error('Invalid age value');
        }

        if (data.phoneNumber && !/^[0-9]{10}$/.test(data.phoneNumber)) {
            throw new Error('Invalid phone number format');
        }
    }

    async submitWithRetry(data, attempt = 1) {
        try {
            const result = await this.performSubmission(data);
            
            // Clear any queued submissions on success
            this.clearSubmissionQueue();
            
            return result;
        } catch (error) {
            console.warn(`Submission attempt ${attempt} failed:`, error.message);
            
            if (attempt < this.maxRetries && this.isRetryableError(error)) {
                // Wait before retrying
                await this.delay(this.retryDelay * attempt);
                return await this.submitWithRetry(data, attempt + 1);
            }
            
            // Queue submission if it's a network error
            if (this.isNetworkError(error)) {
                this.queueSubmission(data);
            }
            
            throw error;
        }
    }

    async performSubmission(data) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(this.scriptURL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Submission failed on server');
            }

            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again');
            }
            
            throw error;
        }
    }

    isRetryableError(error) {
        const retryableErrors = [
            'timeout',
            'network',
            'fetch',
            'Failed to fetch',
            'NetworkError',
            'ERR_NETWORK',
            'ERR_INTERNET_DISCONNECTED'
        ];
        
        return retryableErrors.some(errorType => 
            error.message.toLowerCase().includes(errorType.toLowerCase())
        );
    }

    isNetworkError(error) {
        const networkErrors = [
            'Failed to fetch',
            'NetworkError',
            'ERR_NETWORK',
            'ERR_INTERNET_DISCONNECTED',
            'No internet connection'
        ];
        
        return networkErrors.some(errorType => 
            error.message.includes(errorType)
        );
    }

    queueSubmission(data) {
        try {
            const queue = JSON.parse(localStorage.getItem('submissionQueue') || '[]');
            queue.push({
                data,
                timestamp: Date.now(),
                id: this.generateId()
            });
            
            // Keep only last 10 submissions in queue
            if (queue.length > 10) {
                queue.splice(0, queue.length - 10);
            }
            
            localStorage.setItem('submissionQueue', JSON.stringify(queue));
            console.log('Submission queued for later processing');
        } catch (error) {
            console.error('Failed to queue submission:', error);
        }
    }

    async processQueuedSubmissions() {
        try {
            const queue = JSON.parse(localStorage.getItem('submissionQueue') || '[]');
            if (queue.length === 0) return;

            console.log(`Processing ${queue.length} queued submissions`);

            for (const item of queue) {
                try {
                    await this.performSubmission(item.data);
                    console.log(`Successfully processed queued submission ${item.id}`);
                } catch (error) {
                    console.error(`Failed to process queued submission ${item.id}:`, error);
                    // Keep failed items in queue for next attempt
                    continue;
                }
            }

            // Clear successfully processed items
            this.clearSubmissionQueue();
        } catch (error) {
            console.error('Error processing submission queue:', error);
        }
    }

    clearSubmissionQueue() {
        localStorage.removeItem('submissionQueue');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Health check method
    async checkConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(this.scriptURL, {
                method: 'GET',
                mode: 'no-cors',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get submission statistics
    getStats() {
        const queue = JSON.parse(localStorage.getItem('submissionQueue') || '[]');
        const submissionTimes = JSON.parse(localStorage.getItem('submissionTimes') || '[]');
        
        return {
            queuedSubmissions: queue.length,
            recentSubmissions: submissionTimes.length,
            isOnline: this.isOnline,
            lastSubmission: submissionTimes[submissionTimes.length - 1] || null
        };
    }
}

// Utility class for Google Apps Script management
class AppsScriptManager {
    static validateURL(url) {
        const pattern = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
        return pattern.test(url);
    }

    static extractScriptId(url) {
        const match = url.match(/\/s\/([A-Za-z0-9_-]+)\//);
        return match ? match[1] : null;
    }

    static generateTestData() {
        return {
            timestamp: new Date().toISOString(),
            submissionId: 'TEST_' + Date.now(),
            studentName: 'Test Student',
            age: '18',
            villageName: 'Test Village',
            phoneNumber: '1234567890',
            currentEducation: 'undergraduate',
            schoolName: 'Test School',
            futurePlans: 'Test future plans',
            fatherName: 'Test Father',
            fatherAge: '45',
            fatherOccupation: 'Test Occupation',
            fatherIncome: '50000',
            familyYearlyIncome: '60000',
            totalFamilyMembers: '4',
            earningMembers: '1',
            educationExpenseBearer: 'Father',
            tuitionFees: '10000',
            booksCost: '2000',
            stationeryCost: '1000',
            travelCost: '3000',
            totalExpenses: '16000',
            address: 'Test Address, Test City, Test State - 123456'
        };
    }

    static async testConnection(url) {
        const integration = new SheetsIntegration();
        integration.scriptURL = url;
        
        try {
            const testData = this.generateTestData();
            const result = await integration.submitToSheets(testData);
            return { success: true, result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SheetsIntegration, AppsScriptManager };
} else {
    window.SheetsIntegration = SheetsIntegration;
    window.AppsScriptManager = AppsScriptManager;
}

// Auto-process queued submissions when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (navigator.onLine && CONFIG?.googleSheets?.enabled) {
        const integration = new SheetsIntegration();
        // Process queued submissions after a short delay
        setTimeout(() => {
            integration.processQueuedSubmissions();
        }, 2000);
    }
});
