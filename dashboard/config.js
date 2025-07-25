// Environment Configuration Loader
// This file loads configuration from environment variables or localStorage

class Config {
  constructor() {
    this.config = {};
    this.loadConfig();
  }

  /**
   * Load configuration from various sources
   */
  loadConfig() {
    // Try to load from localStorage first (for user-set values)
    const savedConfig = localStorage.getItem('ngo_config');
    if (savedConfig) {
      try {
        this.config = JSON.parse(savedConfig);
        console.log('Loaded config from localStorage');
        return;
      } catch (error) {
        console.warn('Failed to parse saved config:', error);
      }
    }

    // Temporary: Load your actual credentials for immediate use
    this.config = {
      GOOGLE_SHEET_ID: '',
      GOOGLE_API_KEY: '',
      GOOGLE_SHEET_NAME: 'students'
    };

    // Save to localStorage for persistence
    this.save();
    console.log('Loaded credentials and saved to localStorage');
  }

  /**
   * Get a configuration value
   * @param {string} key - Configuration key
   * @returns {string} Configuration value
   */
  get(key) {
    return this.config[key] || '';
  }

  /**
   * Set a configuration value
   * @param {string} key - Configuration key
   * @param {string} value - Configuration value
   */
  set(key, value) {
    this.config[key] = value;
    this.save();
  }

  /**
   * Update multiple configuration values
   * @param {Object} newConfig - Configuration object
   */
  update(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.save();
  }

  /**
   * Save configuration to localStorage
   */
  save() {
    try {
      localStorage.setItem('ngo_config', JSON.stringify(this.config));
      console.log('Configuration saved');
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  }

  /**
   * Check if all required configuration is present
   * @returns {boolean} True if all required config is present
   */
  isValid() {
    return !!(this.config.GOOGLE_SHEET_ID && this.config.GOOGLE_API_KEY);
  }

  /**
   * Get all configuration (for settings display)
   * @returns {Object} All configuration
   */
  getAll() {
    return { ...this.config };
  }
}

// Export for use in main application
window.Config = Config;
