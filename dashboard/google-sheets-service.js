// Google Sheets Integration Service for Kshitij NGO Dashboard

class GoogleSheetsService {
  constructor(config = null) {
    // Initialize config
    this.config = config || new Config();
    
    // Cache configuration
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Get the Google Sheets API URL for fetching data
   */
  getApiUrl() {
    const sheetId = this.config.get('GOOGLE_SHEET_ID');
    const apiKey = this.config.get('GOOGLE_API_KEY');
    const sheetName = this.config.get('GOOGLE_SHEET_NAME') || 'students';
    
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
  }

  /**
   * Fetch data from Google Sheets
   * @param {boolean} forceRefresh - Force refresh ignoring cache
   * @returns {Promise<Array>} Array of student objects
   */
  async fetchStudents(forceRefresh = false) {
    const cacheKey = 'students';
    
    // Check if configuration is valid
    if (!this.config.isValid()) {
      console.warn('Invalid configuration - using sample data');
      return this.getSampleData();
    }
    
    // Check cache first
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('Returning cached data');
        return cached.data;
      }
    }

    try {
      console.log('Fetching data from Google Sheets...');
      console.log('API URL:', this.getApiUrl());
      const response = await fetch(this.getApiUrl());
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw Google Sheets data:', data);
      
      if (!data.values || data.values.length === 0) {
        throw new Error('No data found in Google Sheet');
      }
      
      const students = this.parseSheetData(data.values);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: students,
        timestamp: Date.now()
      });
      
      console.log(`Fetched ${students.length} students from Google Sheets`);
      return students;
      
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to load data';
      if (error.message.includes('403') || error.message.includes('permission')) {
        errorMessage = 'Permission denied - check API key and sheet permissions';
      } else if (error.message.includes('404')) {
        errorMessage = 'Sheet not found - check Sheet ID and name';
      } else if (error.message.includes('400')) {
        errorMessage = 'Bad request - check configuration';
      }
      
      // Fallback to cached data if available
      if (this.cache.has(cacheKey)) {
        console.log('Using cached data as fallback');
        return this.cache.get(cacheKey).data;
      }
      
      // If no cache and no connection, return sample data
      console.log('Using sample data as fallback');
      const sampleData = this.getSampleData();
      
      // Cache sample data so we don't keep hitting the API
      this.cache.set(cacheKey, {
        data: sampleData,
        timestamp: Date.now()
      });
      
      // Throw error with user-friendly message but still return sample data
      throw new Error(errorMessage);
    }
  }

  /**
   * Parse raw sheet data into student objects
   * @param {Array} rows - Raw rows from Google Sheets
   * @returns {Array} Parsed student objects
   */
  parseSheetData(rows) {
    if (!rows || rows.length < 2) {
      throw new Error('Invalid sheet data');
    }

    const headers = rows[0];
    const students = [];

    // Process each row (skip header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const student = this.parseStudentRow(headers, row);
      if (student) {
        students.push(student);
      }
    }

    return students;
  }

  /**
   * Parse a single student row
   * @param {Array} headers - Column headers
   * @param {Array} row - Student data row
   * @returns {Object} Student object
   */
  parseStudentRow(headers, row) {
    try {
      const student = {};
      console.log('Parsing row:', row);
      console.log('Headers:', headers);
      
      // Map basic fields - updated to match your actual sheet structure
      const fieldMap = {
        'id': 'id',
        'studentName': 'studentName',
        'age': 'age',
        'classStandard': 'classStandard',
        'village': 'village',
        'schoolCollege': 'schoolCollege',
        'currentEducation': 'currentEducation',
        'achievements': 'achievements',
        'futurePlans': 'futurePlans',
        'parentNames': 'parentNames',
        'parentAges': 'parentAges',
        'parentEducation': 'parentEducation',
        'familySize': 'familySize',
        'workingMembers': 'workingMembers',
        'annualIncome': 'annualIncome',
        'incomeSource': 'incomeSource',
        'needsHelp': 'needsHelp',
        'phone': 'phone',
        'address': 'address'
      };

      // Map basic fields
      for (const [csvField, objField] of Object.entries(fieldMap)) {
        const index = headers.indexOf(csvField);
        if (index !== -1 && index < row.length && row[index] !== undefined && row[index] !== '') {
          let value = row[index];
          
          // Parse numeric fields
          if (['id', 'age', 'familySize', 'workingMembers', 'annualIncome'].includes(csvField)) {
            value = parseInt(value) || 0;
          }
          
          student[objField] = value;
        }
      }

      // Parse expenses - these come directly after achievements in your sheet
      student.expenses = {};
      const expenseFields = ['travel', 'schoolFees', 'books', 'stationery', 'uniform', 'tuition'];
      for (const field of expenseFields) {
        const index = headers.indexOf(field);
        if (index !== -1 && index < row.length && row[index] !== undefined && row[index] !== '') {
          student.expenses[field] = parseInt(row[index]) || 0;
        } else {
          student.expenses[field] = 0; // Default to 0 if missing
        }
      }

      // Parse parents object
      if (student.parentNames && student.parentAges && student.parentEducation) {
        student.parents = {
          names: student.parentNames,
          ages: student.parentAges,
          education: student.parentEducation
        };
        // Keep the original fields for backward compatibility
      }

      // Parse years review - handle your actual column names
      student.yearsReview = [];
      const years = ['2020', '2021', '2022', '2023', '2024'];
      for (const year of years) {
        const standardIndex = headers.indexOf(`year${year}_standard`);
        const marksIndex = headers.indexOf(`year${year}_marks`);
        
        if (standardIndex !== -1 && marksIndex !== -1 && 
            standardIndex < row.length && marksIndex < row.length &&
            row[standardIndex] && row[marksIndex]) {
          const marks = parseFloat(row[marksIndex]);
          if (!isNaN(marks)) {
            student.yearsReview.push({
              year: parseInt(year),
              standard: row[standardIndex],
              marks: marks
            });
          }
        }
      }

      // Ensure required fields have defaults
      if (!student.studentName) student.studentName = 'Unknown Student';
      if (!student.age) student.age = 0;
      if (!student.village) student.village = 'Unknown';
      if (!student.annualIncome) student.annualIncome = 0;
      if (!student.expenses) student.expenses = {};

      console.log('Parsed student:', student);
      return student;
    } catch (error) {
      console.error('Error parsing student row:', error, row);
      return null;
    }
  }

  /**
   * Calculate dashboard statistics from student data
   * @param {Array} students - Array of student objects
   * @returns {Object} Dashboard statistics
   */
  calculateStats(students) {
    if (!students || students.length === 0) {
      return {
        totalStudents: 0,
        averageAge: 0,
        medianIncome: 0,
        averageExpenses: 0,
        totalExpenses: 0,
        highestIncome: 0,
        lowestIncome: 0,
        studentsNeedingHelp: 0
      };
    }

    const totalStudents = students.length;
    const totalAge = students.reduce((sum, student) => sum + (student.age || 0), 0);
    const averageAge = Math.round(totalAge / totalStudents);

    const incomes = students.map(s => s.annualIncome || 0).filter(income => income > 0).sort((a, b) => a - b);
    const medianIncome = incomes.length > 0 ? incomes[Math.floor(incomes.length / 2)] : 0;
    const highestIncome = incomes.length > 0 ? Math.max(...incomes) : 0;
    const lowestIncome = incomes.length > 0 ? Math.min(...incomes) : 0;

    const totalExpenses = students.reduce((sum, student) => {
      const expenses = student.expenses || {};
      return sum + Object.values(expenses).reduce((expSum, exp) => expSum + (exp || 0), 0);
    }, 0);
    const averageExpenses = Math.round(totalExpenses / totalStudents);

    const studentsNeedingHelp = students.filter(s => s.needsHelp === 'Ho' || s.needsHelp === 'Yes').length;

    return {
      totalStudents,
      averageAge,
      medianIncome,
      averageExpenses,
      totalExpenses,
      highestIncome,
      lowestIncome,
      studentsNeedingHelp
    };
  }

  /**
   * Calculate age distribution for charts
   * @param {Array} students - Array of student objects
   * @returns {Object} Age distribution data
   */
  calculateAgeDistribution(students) {
    const ageGroups = {
      '15-17': 0,
      '18-20': 0,
      '21-23': 0,
      '24+': 0
    };

    students.forEach(student => {
      const age = student.age || 0;
      if (age >= 15 && age <= 17) ageGroups['15-17']++;
      else if (age >= 18 && age <= 20) ageGroups['18-20']++;
      else if (age >= 21 && age <= 23) ageGroups['21-23']++;
      else if (age >= 24) ageGroups['24+']++;
    });

    return {
      labels: Object.keys(ageGroups),
      data: Object.values(ageGroups),
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']
    };
  }

  /**
   * Calculate village distribution for charts
   * @param {Array} students - Array of student objects
   * @returns {Object} Village distribution data
   */
  calculateVillageDistribution(students) {
    const villages = {};
    
    students.forEach(student => {
      const village = student.village || 'Unknown';
      villages[village] = (villages[village] || 0) + 1;
    });

    // Sort by count and take top 6
    const sortedVillages = Object.entries(villages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    return {
      labels: sortedVillages.map(([village]) => village),
      data: sortedVillages.map(([, count]) => count),
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']
    };
  }

  /**
   * Calculate income source distribution for charts
   * @param {Array} students - Array of student objects
   * @returns {Object} Income source distribution data
   */
  calculateIncomeSourceDistribution(students) {
    const incomeSources = {};
    
    students.forEach(student => {
      const source = student.incomeSource || 'Unknown';
      incomeSources[source] = (incomeSources[source] || 0) + 1;
    });

    return {
      labels: Object.keys(incomeSources),
      data: Object.values(incomeSources),
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']
    };
  }

  /**
   * Calculate expense breakdown for charts
   * @param {Array} students - Array of student objects
   * @returns {Object} Expense breakdown data
   */
  calculateExpenseBreakdown(students) {
    const expenseCategories = {
      travel: 0,
      schoolFees: 0,
      books: 0,
      stationery: 0,
      uniform: 0,
      tuition: 0
    };

    students.forEach(student => {
      const expenses = student.expenses || {};
      Object.keys(expenseCategories).forEach(category => {
        expenseCategories[category] += expenses[category] || 0;
      });
    });

    return {
      labels: Object.keys(expenseCategories).map(key => {
        // Convert camelCase to readable labels
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      }),
      data: Object.values(expenseCategories),
      colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']
    };
  }

  /**
   * Calculate performance trends from years review
   * @param {Array} students - Array of student objects
   * @returns {Object} Performance trend data
   */
  calculatePerformanceTrends(students) {
    const yearlyPerformance = {};
    
    students.forEach(student => {
      if (student.yearsReview && student.yearsReview.length > 0) {
        student.yearsReview.forEach(yearData => {
          const year = yearData.year;
          if (!yearlyPerformance[year]) {
            yearlyPerformance[year] = { totalMarks: 0, count: 0 };
          }
          yearlyPerformance[year].totalMarks += yearData.marks || 0;
          yearlyPerformance[year].count += 1;
        });
      }
    });

    const years = Object.keys(yearlyPerformance).sort();
    const averageMarks = years.map(year => {
      const data = yearlyPerformance[year];
      return Math.round(data.totalMarks / data.count);
    });

    return {
      labels: years,
      data: averageMarks,
      colors: ['#3498db']
    };
  }

  /**
   * Get comprehensive analytics data
   * @param {Array} students - Array of student objects
   * @returns {Object} Complete analytics data for dashboard
   */
  getAnalyticsData(students) {
    return {
      stats: this.calculateStats(students),
      ageDistribution: this.calculateAgeDistribution(students),
      villageDistribution: this.calculateVillageDistribution(students),
      incomeSourceDistribution: this.calculateIncomeSourceDistribution(students),
      expenseBreakdown: this.calculateExpenseBreakdown(students),
      performanceTrends: this.calculatePerformanceTrends(students)
    };
  }

  /**
   * Get sample data for fallback
   * @returns {Array} Sample student data
   */
  getSampleData() {
    return [
      {
        id: 1,
        studentName: "AKSHDA PRAKASH TAKWALE",
        age: 19,
        classStandard: "1st year",
        village: "Kondhur",
        schoolCollege: "Abhinav College",
        currentEducation: "MSc IT",
        yearsReview: [
          {"year": 2022, "standard": "10", "marks": 69.6},
          {"year": 2023, "standard": "11", "marks": 49},
          {"year": 2024, "standard": "12", "marks": 42}
        ],
        achievements: "District athletics bronze",
        expenses: {
          travel: 1000,
          schoolFees: 15000,
          books: 2000,
          stationery: 3000,
          uniform: 1500,
          tuition: 10000
        },
        futurePlans: "Police Bharti",
        parents: {
          names: "Prakash & Vaishali",
          ages: "40 & 35",
          education: "Std 10 both"
        },
        familySize: 6,
        workingMembers: 1,
        annualIncome: 35000,
        incomeSource: "Farming",
        needsHelp: "Ho",
        phone: "9022704532",
        address: "Kondhur Pune"
      },
      {
        id: 2,
        studentName: "PRIYA SURESH PATIL",
        age: 17,
        classStandard: "12th",
        village: "Shivapur",
        schoolCollege: "Govt High School",
        currentEducation: "12th Science",
        yearsReview: [
          {"year": 2022, "standard": "10", "marks": 78.5},
          {"year": 2023, "standard": "11", "marks": 65},
          {"year": 2024, "standard": "12", "marks": 72}
        ],
        achievements: "State level math competition",
        expenses: {
          travel: 800,
          schoolFees: 8000,
          books: 1500,
          stationery: 2000,
          uniform: 1200,
          tuition: 8000
        },
        futurePlans: "Engineering",
        parents: {
          names: "Suresh & Sunita",
          ages: "42 & 38",
          education: "Std 12 both"
        },
        familySize: 4,
        workingMembers: 2,
        annualIncome: 45000,
        incomeSource: "Agriculture",
        needsHelp: "Ho",
        phone: "9876543210",
        address: "Shivapur Pune"
      },
      {
        id: 3,
        studentName: "RAHUL GANESHIMORE",
        age: 20,
        classStandard: "2nd year",
        village: "Wadgaon",
        schoolCollege: "Fergusson College",
        currentEducation: "BSc Computer Science",
        yearsReview: [
          {"year": 2021, "standard": "10", "marks": 82.1},
          {"year": 2022, "standard": "11", "marks": 68},
          {"year": 2023, "standard": "12", "marks": 75}
        ],
        achievements: "College programming contest winner",
        expenses: {
          travel: 1200,
          schoolFees: 20000,
          books: 3000,
          stationery: 2500,
          uniform: 2000,
          tuition: 15000
        },
        futurePlans: "Software Developer",
        parents: {
          names: "Ganesh & Mangala",
          ages: "45 & 40",
          education: "Std 10 & Std 8"
        },
        familySize: 5,
        workingMembers: 1,
        annualIncome: 40000,
        incomeSource: "Labor",
        needsHelp: "Ho",
        phone: "9123456789",
        address: "Wadgaon Pune"
      },
      {
        id: 4,
        studentName: "SNEHA RAMESH JADHAV",
        age: 18,
        classStandard: "1st year",
        village: "Karjat",
        schoolCollege: "Modern College",
        currentEducation: "BCom",
        yearsReview: [
          {"year": 2022, "standard": "10", "marks": 74.8},
          {"year": 2023, "standard": "11", "marks": 58},
          {"year": 2024, "standard": "12", "marks": 61}
        ],
        achievements: "Best student award",
        expenses: {
          travel: 900,
          schoolFees: 12000,
          books: 1800,
          stationery: 2200,
          uniform: 1300,
          tuition: 9000
        },
        futurePlans: "Bank officer",
        parents: {
          names: "Ramesh & Kavita",
          ages: "43 & 39",
          education: "Std 12 & Std 10"
        },
        familySize: 4,
        workingMembers: 2,
        annualIncome: 55000,
        incomeSource: "Small business",
        needsHelp: "Ho",
        phone: "9988776655",
        address: "Karjat Pune"
      },
      {
        id: 5,
        studentName: "AMIT VIJAY KALE",
        age: 16,
        classStandard: "11th",
        village: "Kondhur",
        schoolCollege: "Zilla Parishad School",
        currentEducation: "11th Commerce",
        yearsReview: [
          {"year": 2023, "standard": "10", "marks": 71.2},
          {"year": 2024, "standard": "11", "marks": 55}
        ],
        achievements: "Sports captain",
        expenses: {
          travel: 600,
          schoolFees: 6000,
          books: 1200,
          stationery: 1500,
          uniform: 1000,
          tuition: 5000
        },
        futurePlans: "Chartered Accountant",
        parents: {
          names: "Vijay & Sushila",
          ages: "38 & 35",
          education: "Std 10 both"
        },
        familySize: 5,
        workingMembers: 1,
        annualIncome: 30000,
        incomeSource: "Farming",
        needsHelp: "Ho",
        phone: "9112233445",
        address: "Kondhur Pune"
      },
      {
        id: 6,
        studentName: "POOJA SANTOSH BHOSALE",
        age: 21,
        classStandard: "3rd year",
        village: "Shivapur",
        schoolCollege: "Pune University",
        currentEducation: "BA Psychology",
        yearsReview: [
          {"year": 2020, "standard": "10", "marks": 85.5},
          {"year": 2021, "standard": "11", "marks": 72},
          {"year": 2022, "standard": "12", "marks": 78}
        ],
        achievements: "Research paper published",
        expenses: {
          travel: 1500,
          schoolFees: 18000,
          books: 2500,
          stationery: 3000,
          uniform: 1800,
          tuition: 12000
        },
        futurePlans: "Clinical Psychologist",
        parents: {
          names: "Santosh & Vandana",
          ages: "47 & 42",
          education: "Graduate both"
        },
        familySize: 3,
        workingMembers: 2,
        annualIncome: 65000,
        incomeSource: "Teaching",
        needsHelp: "Ho",
        phone: "9876543221",
        address: "Shivapur Pune"
      }
    ];
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Update configuration
   * @param {Object} newConfig - Configuration object
   */
  updateConfig(newConfig) {
    this.config.update(newConfig);
    this.clearCache(); // Clear cache when config changes
  }
}

// Export for use in main application
window.GoogleSheetsService = GoogleSheetsService;
