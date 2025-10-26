// Data security utilities for handling sensitive information

/**
 * Sanitize photo data by removing base64 data after successful upload
 * This reduces localStorage size and prevents photo data leakage
 */
export const sanitizePhotoData = (photoBase64: string): string => {
  // Return a marker instead of the full base64 data
  return '[Photo uploaded - data removed for security]'
}

/**
 * Check if localStorage is approaching quota limits
 * Most browsers have 5-10MB limit for localStorage
 */
export const checkLocalStorageSize = (): { used: number; available: number; percentage: number } => {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, percentage: 0 }
  }

  let used = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length
    }
  }

  // Typical localStorage limit is 5MB
  const available = 5 * 1024 * 1024
  const percentage = (used / available) * 100

  return {
    used,
    available,
    percentage
  }
}

/**
 * Validate that data doesn't contain any XSS or injection attempts
 */
export const sanitizeTextInput = (input: string): string => {
  if (!input) return ''
  
  // Remove any HTML tags
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
}

/**
 * Rate limiting for form submissions (client-side)
 * Prevents spam by tracking submission timestamps
 */
const SUBMISSION_COOLDOWN = 60000 // 1 minute in milliseconds
const SUBMISSION_KEY = 'last_form_submission'

export const canSubmitForm = (): { allowed: boolean; waitTime?: number } => {
  if (typeof window === 'undefined') {
    return { allowed: true }
  }

  const lastSubmission = localStorage.getItem(SUBMISSION_KEY)
  
  if (!lastSubmission) {
    return { allowed: true }
  }

  const lastTime = parseInt(lastSubmission, 10)
  const now = Date.now()
  const timeSinceLastSubmission = now - lastTime

  if (timeSinceLastSubmission < SUBMISSION_COOLDOWN) {
    const waitTime = Math.ceil((SUBMISSION_COOLDOWN - timeSinceLastSubmission) / 1000)
    return { allowed: false, waitTime }
  }

  return { allowed: true }
}

export const recordFormSubmission = (): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SUBMISSION_KEY, Date.now().toString())
}

/**
 * Clear sensitive data from memory
 * Should be called when form is reset or user navigates away
 */
export const clearSensitiveData = (): void => {
  // Clear any temporary data
  if (typeof window !== 'undefined') {
    // Remove any temporary photo data
    sessionStorage.clear()
  }
}
