// Student Sponsorship Dashboard Application

// Sample data based on the provided structure
const sampleStudents = [
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

// Application state
let currentPage = 'home';
let currentStudentId = null;
let filteredStudents = [...sampleStudents];
let currentPageNum = 1;
let studentsPerPage = 6;
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('App initialized');
  initializeNavigation();
  initializeSearch();
  initializePagination();
  loadHomePage();
});

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
    case 'student-profile':
      // Profile content already loaded
      break;
  }
}

// Home Page
function loadHomePage() {
  console.log('Loading home page');
  const stats = calculateStats();
  
  const totalStudentsEl = document.getElementById('total-students');
  const averageAgeEl = document.getElementById('average-age');
  const medianIncomeEl = document.getElementById('median-income');
  const avgExpensesEl = document.getElementById('avg-expenses');
  
  if (totalStudentsEl) totalStudentsEl.textContent = stats.totalStudents;
  if (averageAgeEl) averageAgeEl.textContent = stats.averageAge;
  if (medianIncomeEl) medianIncomeEl.textContent = `₹${stats.medianIncome.toLocaleString()}`;
  if (avgExpensesEl) avgExpensesEl.textContent = `₹${stats.avgExpenses.toLocaleString()}`;
}

// Statistics calculation
function calculateStats() {
  const totalStudents = sampleStudents.length;
  const averageAge = Math.round(sampleStudents.reduce((sum, student) => sum + student.age, 0) / totalStudents);
  
  const incomes = sampleStudents.map(s => s.annualIncome).sort((a, b) => a - b);
  const medianIncome = incomes[Math.floor(incomes.length / 2)];
  
  const avgExpenses = Math.round(sampleStudents.reduce((sum, student) => {
    const totalExpenses = Object.values(student.expenses).reduce((expSum, exp) => expSum + exp, 0);
    return sum + totalExpenses;
  }, 0) / totalStudents);

  return { totalStudents, averageAge, medianIncome, avgExpenses };
}

// Dashboard Page
function loadDashboard() {
  console.log('Loading dashboard');
  setTimeout(() => {
    createAgeChart();
    createIncomeChart();
    createVillageChart();
    createExpenseChart();
  }, 100);
}

function createAgeChart() {
  const canvas = document.getElementById('ageChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const ageGroups = {
    '15-17': 0,
    '18-20': 0,
    '21-23': 0,
    '24+': 0
  };

  sampleStudents.forEach(student => {
    if (student.age <= 17) ageGroups['15-17']++;
    else if (student.age <= 20) ageGroups['18-20']++;
    else if (student.age <= 23) ageGroups['21-23']++;
    else ageGroups['24+']++;
  });

  if (charts.ageChart) {
    charts.ageChart.destroy();
  }
  
  charts.ageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(ageGroups),
      datasets: [{
        label: 'Number of Students',
        data: Object.values(ageGroups),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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

function createIncomeChart() {
  const canvas = document.getElementById('incomeChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const incomeSources = {};
  sampleStudents.forEach(student => {
    incomeSources[student.incomeSource] = (incomeSources[student.incomeSource] || 0) + 1;
  });

  if (charts.incomeChart) {
    charts.incomeChart.destroy();
  }
  
  charts.incomeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(incomeSources),
      datasets: [{
        data: Object.values(incomeSources),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function createVillageChart() {
  const canvas = document.getElementById('villageChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const villages = {};
  sampleStudents.forEach(student => {
    villages[student.village] = (villages[student.village] || 0) + 1;
  });

  if (charts.villageChart) {
    charts.villageChart.destroy();
  }
  
  charts.villageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(villages),
      datasets: [{
        label: 'Number of Students',
        data: Object.values(villages),
        backgroundColor: '#1FB8CD'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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

function createExpenseChart() {
  const canvas = document.getElementById('expenseChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const expenseCategories = {
    travel: 0,
    schoolFees: 0,
    books: 0,
    stationery: 0,
    uniform: 0,
    tuition: 0
  };

  sampleStudents.forEach(student => {
    Object.keys(student.expenses).forEach(category => {
      expenseCategories[category] += student.expenses[category];
    });
  });

  // Calculate averages
  Object.keys(expenseCategories).forEach(category => {
    expenseCategories[category] = Math.round(expenseCategories[category] / sampleStudents.length);
  });

  if (charts.expenseChart) {
    charts.expenseChart.destroy();
  }
  
  charts.expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Travel', 'School Fees', 'Books', 'Stationery', 'Uniform', 'Tuition'],
      datasets: [{
        label: 'Average Expense (₹)',
        data: Object.values(expenseCategories),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
  
  filteredStudents = sampleStudents.filter(student => 
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

  const totalExpenses = Object.values(student.expenses).reduce((sum, exp) => sum + exp, 0);

  card.innerHTML = `
    <div class="card__body">
      <h3>${student.studentName}</h3>
      <div class="student-info">
        <div class="student-info-row">
          <span class="student-label">Age:</span>
          <span class="student-value">${student.age} years</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Class:</span>
          <span class="student-value">${student.classStandard}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Village:</span>
          <span class="student-value">${student.village}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Education:</span>
          <span class="student-value">${student.currentEducation}</span>
        </div>
        <div class="student-info-row">
          <span class="student-label">Annual Income:</span>
          <span class="student-value currency">₹${student.annualIncome.toLocaleString()}</span>
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
  const student = sampleStudents.find(s => s.id === studentId);
  if (!student) return;

  currentStudentId = studentId;
  renderStudentProfile(student);
  showPage('student-profile');
}

function renderStudentProfile(student) {
  const profileContent = document.getElementById('profile-content');
  if (!profileContent) return;
  
  const totalExpenses = Object.values(student.expenses).reduce((sum, exp) => sum + exp, 0);
  
  profileContent.innerHTML = `
    <div class="profile-header">
      <div class="profile-title">
        <h1>${student.studentName}</h1>
        <p class="profile-subtitle">${student.currentEducation} • ${student.village}</p>
      </div>
      <div class="profile-actions">
        <button class="btn btn--primary">Sponsor Student</button>
        <a href="tel:${student.phone}" class="btn btn--outline">Call Student</a>
      </div>
    </div>

    <div class="profile-grid">
      <div class="card">
        <div class="card__body">
          <div class="profile-section">
            <h3>Personal Information</h3>
            <div class="profile-field">
              <span class="profile-field-label">Full Name:</span>
              <span class="profile-field-value">${student.studentName}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Age:</span>
              <span class="profile-field-value">${student.age} years</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Class:</span>
              <span class="profile-field-value">${student.classStandard}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">School/College:</span>
              <span class="profile-field-value">${student.schoolCollege}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Current Education:</span>
              <span class="profile-field-value">${student.currentEducation}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Future Plans:</span>
              <span class="profile-field-value">${student.futurePlans}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Achievements:</span>
              <span class="profile-field-value">${student.achievements}</span>
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
              <span class="profile-field-value">${student.parents.names}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Parent Ages:</span>
              <span class="profile-field-value">${student.parents.ages}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Parent Education:</span>
              <span class="profile-field-value">${student.parents.education}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Family Size:</span>
              <span class="profile-field-value">${student.familySize} members</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Working Members:</span>
              <span class="profile-field-value">${student.workingMembers}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Annual Income:</span>
              <span class="profile-field-value currency">₹${student.annualIncome.toLocaleString()}</span>
            </div>
            <div class="profile-field">
              <span class="profile-field-label">Income Source:</span>
              <span class="profile-field-value">${student.incomeSource}</span>
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
            ${Object.entries(student.expenses).map(([category, amount]) => `
              <div class="expense-item">
                <span class="expense-label">${formatExpenseCategory(category)}:</span>
                <span class="expense-amount">₹${amount.toLocaleString()}</span>
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
            ${student.yearsReview.map(year => `
              <div class="year-item">
                <div class="year-info">
                  <span class="year-label">Year ${year.year}:</span>
                  <span class="year-value">Standard ${year.standard}</span>
                </div>
                <div class="marks-badge">${year.marks}%</div>
              </div>
            `).join('')}
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
              <a href="tel:${student.phone}" class="phone-link">${student.phone}</a>
            </span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Address:</span>
            <span class="profile-field-value">${student.address}</span>
          </div>
          <div class="profile-field">
            <span class="profile-field-label">Needs Help:</span>
            <span class="profile-field-value">${student.needsHelp}</span>
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