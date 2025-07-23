// Student Sponsorship Dashboard Application with Google Sheets Integration

// Application state
let currentPage = 'home';
let currentStudentId = null;
let filteredStudents = [];
let currentPageNum = 1;
let studentsPerPage = 6;
let charts = {};
let googleSheetsService = null;
let config = null;
let allStudents = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized');
  
  // Initialize configuration
  config = new Config();
  
  // Initialize Google Sheets service with config
  googleSheetsService = new GoogleSheetsService(config);
  
  // Load saved configuration
  loadSavedConfiguration();
  
  initializeNavigation();
  initializeSearch();
  initializePagination();
  initializeSettings();
  initializeSyncStatus();
  
  // Load initial data
  loadData();
});

// Data Loading Functions
async function loadData(forceRefresh = false) {
  updateSyncStatus('loading', 'Loading data...');
  
  try {
    console.log('Starting data load, forceRefresh:', forceRefresh);
    allStudents = await googleSheetsService.fetchStudents(forceRefresh);
    filteredStudents = [...allStudents];
    
    console.log('Successfully loaded students:', allStudents.length);
    console.log('Sample student data:', allStudents[0]);
    
    updateSyncStatus('connected', `Connected - ${allStudents.length} students loaded`);
    updateLastSyncTime();
    
    // Update current page if visible
    if (currentPage === 'home') {
      console.log('Updating home page with new data');
      loadHomePage();
    } else if (currentPage === 'students') {
      console.log('Updating students page with new data');
      loadStudentsPage();
    } else if (currentPage === 'dashboard') {
      console.log('Updating dashboard with new data');
      loadDashboard();
    }
    
    console.log(`Loaded ${allStudents.length} students from data source`);
    
  } catch (error) {
    console.error('Error loading data:', error);
    updateSyncStatus('error', 'Failed to load data - using cached/sample data');
    
    // Fallback to sample data if available
    if (allStudents.length === 0) {
      console.log('Using sample data as fallback');
      allStudents = googleSheetsService.getSampleData();
      filteredStudents = [...allStudents];
      
      // Update current page with sample data
      if (currentPage === 'home') {
        loadHomePage();
      } else if (currentPage === 'students') {
        loadStudentsPage();
      } else if (currentPage === 'dashboard') {
        loadDashboard();
      }
    }
  }
}

// Configuration Functions
function loadSavedConfiguration() {
  // Configuration is automatically loaded by the Config class
  // Just populate the form fields when they become available
  setTimeout(() => {
    const sheetIdField = document.getElementById('sheet-id');
    const apiKeyField = document.getElementById('api-key');
    const sheetNameField = document.getElementById('sheet-name');
    
    if (sheetIdField) sheetIdField.value = config.get('GOOGLE_SHEET_ID') || '';
    if (apiKeyField) apiKeyField.value = config.get('GOOGLE_API_KEY') || '';
    if (sheetNameField) sheetNameField.value = config.get('GOOGLE_SHEET_NAME') || 'students';
  }, 100);
}

function saveConfiguration(newConfig) {
  // Update config using the new system
  const configUpdate = {
    GOOGLE_SHEET_ID: newConfig.sheetId,
    GOOGLE_API_KEY: newConfig.apiKey,
    GOOGLE_SHEET_NAME: newConfig.sheetName
  };
  
  config.update(configUpdate);
  googleSheetsService.updateConfig(configUpdate);
}

// Sync Status Functions
function updateSyncStatus(status, message) {
  const syncDot = document.getElementById('sync-dot');
  const syncText = document.getElementById('sync-status-text');
  
  if (syncDot && syncText) {
    syncDot.className = `sync-dot ${status}`;
    syncText.textContent = message;
  }
}

function updateLastSyncTime() {
  const lastSyncElement = document.getElementById('last-sync');
  if (lastSyncElement) {
    const now = new Date();
    lastSyncElement.textContent = `Last sync: ${now.toLocaleTimeString()}`;
  }
}

// Settings Page Functions
function initializeSettings() {
  const configForm = document.getElementById('sheets-config-form');
  const testConnectionBtn = document.getElementById('test-connection');
  const refreshBtn = document.getElementById('refresh-data');
  const clearCacheBtn = document.getElementById('clear-cache');
  const exportDataBtn = document.getElementById('export-data');
  
  if (configForm) {
    configForm.addEventListener('submit', handleConfigSubmit);
  }
  
  if (testConnectionBtn) {
    testConnectionBtn.addEventListener('click', handleTestConnection);
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadData(true));
  }
  
  if (clearCacheBtn) {
    clearCacheBtn.addEventListener('click', handleClearCache);
  }
  
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', handleExportData);
  }
}

function handleConfigSubmit(e) {
  e.preventDefault();
  
  const config = {
    sheetId: document.getElementById('sheet-id').value.trim(),
    apiKey: document.getElementById('api-key').value.trim(),
    sheetName: document.getElementById('sheet-name').value.trim() || 'Students'
  };
  
  if (!config.sheetId || !config.apiKey) {
    alert('Please enter both Sheet ID and API Key');
    return;
  }
  
  saveConfiguration(config);
  alert('Configuration saved successfully!');
  
  // Refresh data with new configuration
  loadData(true);
}

async function handleTestConnection() {
  const config = {
    sheetId: document.getElementById('sheet-id').value.trim(),
    apiKey: document.getElementById('api-key').value.trim(),
    sheetName: document.getElementById('sheet-name').value.trim() || 'Students'
  };
  
  if (!config.sheetId || !config.apiKey) {
    alert('Please enter both Sheet ID and API Key');
    return;
  }
  
  const testBtn = document.getElementById('test-connection');
  const originalText = testBtn.textContent;
  testBtn.textContent = 'Testing...';
  testBtn.disabled = true;
  
  try {
    // Temporarily update config for testing
    googleSheetsService.updateConfig(config);
    const testData = await googleSheetsService.fetchStudents(true);
    
    alert(`Connection successful! Found ${testData.length} students.`);
  } catch (error) {
    alert(`Connection failed: ${error.message}`);
  } finally {
    testBtn.textContent = originalText;
    testBtn.disabled = false;
  }
}

function handleClearCache() {
  googleSheetsService.clearCache();
  alert('Cache cleared successfully!');
}

function handleExportData() {
  if (allStudents.length === 0) {
    alert('No data to export');
    return;
  }
  
  // Convert to CSV
  const headers = [
    'ID', 'Name', 'Age', 'Class', 'Village', 'School/College', 'Education',
    'Annual Income', 'Income Source', 'Phone', 'Address'
  ];
  
  const csvData = [
    headers.join(','),
    ...allStudents.map(student => [
      student.id,
      `"${student.studentName}"`,
      student.age,
      `"${student.classStandard}"`,
      `"${student.village}"`,
      `"${student.schoolCollege}"`,
      `"${student.currentEducation}"`,
      student.annualIncome,
      `"${student.incomeSource}"`,
      student.phone,
      `"${student.address}"`
    ].join(','))
  ].join('\n');
  
  // Download
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ngo-students-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      console.log('Navigation clicked:', page);
      showPage(page);
    });
  });

  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showPage('students');
    });
  }
}

// Page Management
function showPage(page) {
  console.log('Showing page:', page);
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeNavLink = document.querySelector(`[data-page="${page}"]`);
  if (activeNavLink) {
    activeNavLink.classList.add('active');
  }

  // Update page content
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  
  const targetPage = document.getElementById(`${page}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  currentPage = page;

  // Load page-specific content
  switch(page) {
    case 'home':
      loadHomePage();
      break;
    case 'dashboard':
      loadDashboard();
      break;
    case 'students':
      loadStudentsPage();
      break;
    case 'settings':
      loadSettingsPage();
      break;
    case 'student-profile':
      // Profile content already loaded
      break;
  }
}

// Home Page
function loadHomePage() {
  console.log('Loading home page with dynamic data');
  
  // Get comprehensive analytics data
  const analyticsData = googleSheetsService.getAnalyticsData(allStudents);
  const stats = analyticsData.stats;
  
  // Update all statistics
  updateDashboardStats(stats);
  
  // Also update individual elements by ID (for backward compatibility)
  const totalStudentsEl = document.getElementById('total-students');
  const averageAgeEl = document.getElementById('average-age');
  const medianIncomeEl = document.getElementById('median-income');
  const avgExpensesEl = document.getElementById('avg-expenses');
  
  if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
  if (averageAgeEl) averageAgeEl.textContent = stats.averageAge;
  if (medianIncomeEl) medianIncomeEl.textContent = `₹${stats.medianIncome.toLocaleString()}`;
  if (avgExpensesEl) avgExpensesEl.textContent = `₹${stats.averageExpenses.toLocaleString()}`;
}

// Settings page loading
function loadSettingsPage() {
  console.log('Loading settings page');
  loadSavedConfiguration();
}

// Statistics calculation (kept for backward compatibility)
function calculateStats() {
  return googleSheetsService.calculateStats(allStudents);
}

// Dashboard Page
function loadDashboard() {
  console.log('Loading dashboard with dynamic data');
  
  if (!allStudents || allStudents.length === 0) {
    console.warn('No student data available for dashboard');
    return;
  }
  
  try {
    // Get analytics data from Google Sheets service
    const analyticsData = googleSheetsService.getAnalyticsData(allStudents);
    console.log('Analytics data:', analyticsData);
    
    setTimeout(() => {
      createAgeChart(analyticsData.ageDistribution);
      createIncomeChart(analyticsData.incomeSourceDistribution);
      createVillageChart(analyticsData.villageDistribution);
      createExpenseChart(analyticsData.expenseBreakdown);
      createPerformanceChart(analyticsData.performanceTrends);
      updateDashboardStats(analyticsData.stats);
    }, 100);
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function createAgeChart(ageData) {
  const canvas = document.getElementById('ageChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.ageChart) {
    charts.ageChart.destroy();
  }
  
  charts.ageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ageData.labels,
      datasets: [{
        label: 'Number of Students',
        data: ageData.data,
        backgroundColor: ageData.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Age Distribution',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function createIncomeChart(incomeData) {
  const canvas = document.getElementById('incomeChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.incomeChart) {
    charts.incomeChart.destroy();
  }
  
  charts.incomeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: incomeData.labels,
      datasets: [{
        data: incomeData.data,
        backgroundColor: incomeData.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Income Sources',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    }
  });
}

function createVillageChart(villageData) {
  const canvas = document.getElementById('villageChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.villageChart) {
    charts.villageChart.destroy();
  }
  
  charts.villageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: villageData.labels,
      datasets: [{
        label: 'Number of Students',
        data: villageData.data,
        backgroundColor: villageData.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Students by Village',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

function createExpenseChart(expenseData) {
  const canvas = document.getElementById('expenseChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.expenseChart) {
    charts.expenseChart.destroy();
  }
  
  charts.expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: expenseData.labels,
      datasets: [{
        label: 'Total Expenses (₹)',
        data: expenseData.data,
        backgroundColor: expenseData.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Expense Breakdown',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// New function for performance trends
function createPerformanceChart(performanceData) {
  const canvas = document.getElementById('performanceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');

  if (charts.performanceChart) {
    charts.performanceChart.destroy();
  }
  
  charts.performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: performanceData.labels,
      datasets: [{
        label: 'Average Marks (%)',
        data: performanceData.data,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Academic Performance Trends',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// Function to update dashboard statistics
function updateDashboardStats(stats) {
  // Update stats cards on home page
  const totalStudentsEl = document.querySelector('[data-stat="total-students"]');
  const averageAgeEl = document.querySelector('[data-stat="average-age"]');
  const medianIncomeEl = document.querySelector('[data-stat="median-income"]');
  const averageExpensesEl = document.querySelector('[data-stat="average-expenses"]');
  
  if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents.toLocaleString();
  if (averageAgeEl) averageAgeEl.textContent = stats.averageAge + ' years';
  if (medianIncomeEl) medianIncomeEl.textContent = '₹' + stats.medianIncome.toLocaleString();
  if (averageExpensesEl) averageExpensesEl.textContent = '₹' + stats.averageExpenses.toLocaleString();
  
  // Update additional stats if elements exist
  const totalExpensesEl = document.querySelector('[data-stat="total-expenses"]');
  const studentsNeedingHelpEl = document.querySelector('[data-stat="students-needing-help"]');
  
  if (totalExpensesEl) totalExpensesEl.textContent = '₹' + stats.totalExpenses.toLocaleString();
  if (studentsNeedingHelpEl) studentsNeedingHelpEl.textContent = stats.studentsNeedingHelp;
}

// Students Page
function loadStudentsPage() {
  console.log('Loading students page');
  renderStudentsGrid();
  updatePagination();
}

function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterStudents();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortStudents();
    });
  }
}

function filterStudents() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  
  filteredStudents = allStudents.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm) ||
    student.village.toLowerCase().includes(searchTerm) ||
    student.currentEducation.toLowerCase().includes(searchTerm)
  );

  currentPageNum = 1;
  renderStudentsGrid();
  updatePagination();
}

function sortStudents() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;
  
  const sortBy = sortSelect.value;
  
  filteredStudents.sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.studentName.localeCompare(b.studentName);
      case 'age':
        return a.age - b.age;
      case 'income':
        return a.annualIncome - b.annualIncome;
      default:
        return 0;
    }
  });

  renderStudentsGrid();
}

function renderStudentsGrid() {
  const grid = document.getElementById('students-grid');
  if (!grid) return;
  
  const startIndex = (currentPageNum - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const studentsToShow = filteredStudents.slice(startIndex, endIndex);

  grid.innerHTML = '';

  studentsToShow.forEach(student => {
    const studentCard = createStudentCard(student);
    grid.appendChild(studentCard);
  });
}

function createStudentCard(student) {
  const card = document.createElement('div');
  card.className = 'card student-card';
  card.addEventListener('click', () => showStudentProfile(student.id));

  // Safely calculate total expenses
  const expenses = student.expenses || {};
  const totalExpenses = Object.values(expenses).reduce((sum, exp) => sum + (exp || 0), 0);

  card.innerHTML = `
    <div class="card__body">
      <h3>${student.studentName || 'Unknown Student'}</h3>
      <div class="student-info">
        <div class="student-info-row">
          <span class="student-label">Age:</span>
          <span class="student-value">${student.age || 0} years</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Class:</span>
          <span class="student-value">${student.classStandard || 'N/A'}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Village:</span>
          <span class="student-value">${student.village || 'N/A'}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Education:</span>
          <span class="student-value">${student.currentEducation || 'N/A'}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Annual Income:</span>
          <span class="student-value currency">₹${(student.annualIncome || 0).toLocaleString()}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Total Expenses:</span>
          <span class="student-value currency">₹${totalExpenses.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;

  return card;
}

// Pagination
function initializePagination() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentPageNum > 1) {
        currentPageNum--;
        renderStudentsGrid();
        updatePagination();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
      if (currentPageNum < totalPages) {
        currentPageNum++;
        renderStudentsGrid();
        updatePagination();
      }
    });
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const pageInfo = document.getElementById('page-info');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPageNum} of ${totalPages}`;
  }
  
  if (prevBtn) {
    prevBtn.disabled = currentPageNum === 1;
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentPageNum === totalPages;
  }
}

// Student Profile
function showStudentProfile(studentId) {
  console.log('Showing student profile:', studentId);
  const student = allStudents.find(s => s.id === studentId);
  if (!student) return;

  currentStudentId = studentId;
  renderStudentProfile(student);
  showPage('student-profile');
}

function renderStudentProfile(student) {
  const profileContent = document.getElementById('profile-content');
  if (!profileContent) return;
  
  // Safely calculate total expenses
  const expenses = student.expenses || {};
  const totalExpenses = Object.values(expenses).reduce((sum, exp) => sum + (exp || 0), 0);
  
  // Safely get parent data
  const parents = student.parents || {};
  const parentNames = parents.names || student.parentNames || 'N/A';
  const parentAges = parents.ages || student.parentAges || 'N/A';
  const parentEducation = parents.education || student.parentEducation || 'N/A';
  
  profileContent.innerHTML = `
    <div class="profile-header">
      <div class="profile-title">
        <h1>${student.studentName || 'Unknown Student'}</h1>
        <p class="profile-subtitle">${student.currentEducation || 'N/A'} • ${student.village || 'N/A'}</p>
      </div>
      <div class="profile-actions">
        <button class="btn btn--primary">Sponsor Student</button>
        <a href="tel:${student.phone || ''}" class="btn btn--outline">Call Student</a>
      </div>
    </div>

    <div class="profile-grid">
      <div class="card">
        <div class="card__body">
          <div class="profile-section">
            <h3>Personal Information</h3>
            <div class="profile-field">
              <span class="profile-field-label">Full Name:</span>
              <span class="profile-field-value">${student.studentName || 'N/A'}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Age:</span>
              <span class="profile-field-value">${student.age || 0} years</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Class:</span>
              <span class="profile-field-value">${student.classStandard || 'N/A'}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">School/College:</span>
              <span class="profile-field-value">${student.schoolCollege || 'N/A'}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Current Education:</span>
              <span class="profile-field-value">${student.currentEducation || 'N/A'}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Future Plans:</span>
              <span class="profile-field-value">${student.futurePlans || 'N/A'}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Achievements:</span>
              <span class="profile-field-value">${student.achievements || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__body">
          <div class="profile-section">
            <h3>Family Information</h3>
            <div class="profile-field">
              <span class="profile-field-label">Parents:</span>
              <span class="profile-field-value">${parentNames}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Parent Ages:</span>
              <span class="profile-field-value">${parentAges}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Parent Education:</span>
              <span class="profile-field-value">${parentEducation}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Family Size:</span>
              <span class="profile-field-value">${student.familySize || 0} members</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Working Members:</span>
              <span class="profile-field-value">${student.workingMembers || 0}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Annual Income:</span>
              <span class="profile-field-value currency">₹${(student.annualIncome || 0).toLocaleString()}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Income Source:</span>
              <span class="profile-field-value">${student.incomeSource || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card__body">
        <div class="profile-section">
          <h3>Educational Expenses Breakdown</h3>
          <div class="expenses-breakdown">
            ${Object.entries(expenses).map(([category, amount]) => `
              <div class="expense-item">
                <span class="expense-label">${formatExpenseCategory(category)}:</span>
                <span class="expense-amount">₹${(amount || 0).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
          <div class="profile-field" style="margin-top: 1rem; border-top: 2px solid var(--color-primary); padding-top: 1rem;">
            <span class="profile-field-label"><strong>Total Expenses:</strong></span>
            <span class="profile-field-value currency"><strong>₹${totalExpenses.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card__body">
        <div class="profile-section">
          <h3>Academic Performance</h3>
          <div class="years-review">
            ${(student.yearsReview || []).map(year => `
              <div class="year-item">
                <div class="year-info">
                  <span class="year-label">Year ${year.year}:</span>
                  <span class="year-value">Standard ${year.standard}</span>
                </div>
                <div class="marks-badge">${year.marks}%</div>
              </div>
            `).join('') || '<p>No academic data available</p>'}
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card__body">
        <div class="profile-section">
          <h3>Contact Information</h3>
          <div class="profile-field">
            <span class="profile-field-label">Phone:</span>
            <span class="profile-field-value">
              <a href="tel:${student.phone || ''}" class="phone-link">${student.phone || 'N/A'}</a>
            </span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Address:</span>
            <span class="profile-field-value">${student.address || 'N/A'}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Needs Help:</span>
            <span class="profile-field-value">${student.needsHelp || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatExpenseCategory(category) {
  const categoryMap = {
    travel: 'Travel',
    schoolFees: 'School Fees',
    books: 'Books',
    stationery: 'Stationery',
    uniform: 'Uniform',
    tuition: 'Tuition'
  };
  return categoryMap[category] || category;
}

function initializeSyncStatus() {
  // Auto-sync every 5 minutes if enabled
  const autoSyncCheckbox = document.getElementById('auto-sync');
  if (autoSyncCheckbox && autoSyncCheckbox.checked) {
    setInterval(() => {
      if (!document.getElementById('offline-mode')?.checked) {
        loadData();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}