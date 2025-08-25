import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface Student {
  id: string
  name: string
  age: number
  class: string
  village: string
  school: string
  currentEducation: string
  academicPerformance: {
    year1: string
    year2: string
    year3: string
  }
  achievements: string
  futurePlans: string
  disability: string
  fatherName: string
  motherName: string
  parentAge: string
  parentEducation: string
  totalFamilyMembers: number
  earningMembers: number
  phone: string
  address: string
  status: 'pending' | 'approved' | 'rejected'
  expenses: {
    travel: number
    fees: number
    books: number
    stationery: number
    uniform: number
    tuition: number
    other: number
  }
  totalExpenses: number
  familyIncome: number
  incomeSource: string
  expenseBearer: string
  needsHelp: string
  submissionDate: string
}

export const generateStudentProfilePDF = (student: Student) => {
  const doc = new jsPDF()
  
  // NGO Header with branding
  doc.setFontSize(24)
  doc.setTextColor(0, 102, 204)
  doc.text('KSHITIJ NGO', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Student Sponsorship Program', 105, 28, { align: 'center' })
  
  // Divider line
  doc.setDrawColor(0, 102, 204)
  doc.line(20, 35, 190, 35)
  
  // Student Profile Title
  doc.setFontSize(18)
  doc.setTextColor(0, 0, 0)
  doc.text('STUDENT PROFILE REPORT', 20, 50)
  
  // Basic Information
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('BASIC INFORMATION', 20, 65)
  
  const basicInfo = [
    ['Name', student.name],
    ['Age', `${student.age} years`],
    ['Class/Standard', student.class],
    ['Current Education', student.currentEducation || 'N/A'],
    ['School/College', student.school],
    ['Village/City', student.village],
    ['Phone Number', student.phone],
    ['Application Status', student.status.toUpperCase()]
  ]
  
  autoTable(doc, {
    startY: 70,
    head: [['Field', 'Details']],
    body: basicInfo,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 20, right: 20 }
  })
  
  // Family Information
  let currentY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('FAMILY INFORMATION', 20, currentY)
  
  const familyInfo = [
    ['Father\'s Name', student.fatherName],
    ['Mother\'s Name', student.motherName || 'N/A'],
    ['Parent Ages', student.parentAge],
    ['Parent Education', student.parentEducation],
    ['Total Family Members', student.totalFamilyMembers.toString()],
    ['Earning Members', student.earningMembers.toString()],
    ['Income Source', student.incomeSource],
    ['Annual Family Income', `Rs. ${student.familyIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`]
  ]
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Field', 'Details']],
    body: familyInfo,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 20, right: 20 }
  })
  
  // Academic Performance
  currentY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('ACADEMIC PERFORMANCE', 20, currentY)
  
  const academicData = [
    ['Year 1', student.academicPerformance.year1],
    ['Year 2', student.academicPerformance.year2],
    ['Year 3', student.academicPerformance.year3]
  ].filter(row => row[1] && row[1].trim())
  
  if (academicData.length > 0) {
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Period', 'Performance Details']],
      body: academicData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204] },
      margin: { left: 20, right: 20 }
    })
    currentY = (doc as any).lastAutoTable.finalY + 15
  } else {
    currentY += 10
  }
  
  // Financial Breakdown
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('FINANCIAL BREAKDOWN', 20, currentY)
  
  const expenseData = [
    ['Travel Expenses', `Rs. ${student.expenses.travel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['School/College Fees', `Rs. ${student.expenses.fees.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Books & Materials', `Rs. ${student.expenses.books.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Stationery', `Rs. ${student.expenses.stationery.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Uniform', `Rs. ${student.expenses.uniform.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Tuition/Coaching', `Rs. ${student.expenses.tuition.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Other Expenses', `Rs. ${(student.expenses.other || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['TOTAL EDUCATION EXPENSES', `Rs. ${student.totalExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`]
  ]
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Expense Category', 'Amount']],
    body: expenseData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    bodyStyles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
    didParseCell: function(data) {
      if (data.row.index === expenseData.length - 1) {
        data.cell.styles.fontStyle = 'bold'
        data.cell.styles.fillColor = [240, 248, 255]
      }
    }
  })
  
  // Additional Information
  currentY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('ADDITIONAL INFORMATION', 20, currentY)
  
  const additionalInfo = [
    ['Future Plans', student.futurePlans],
    ['Achievements', student.achievements || 'None mentioned'],
    ['Disability Status', student.disability || 'None'],
    ['Needs Help', student.needsHelp],
    ['Expense Bearer', student.expenseBearer],
    ['Submission Date', new Date(student.submissionDate).toLocaleDateString('en-IN')]
  ]
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Field', 'Details']],
    body: additionalInfo,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 20, right: 20 }
  })
  
  // Address
  currentY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('ADDRESS', 20, currentY)
  
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  const splitAddress = doc.splitTextToSize(student.address, 170)
  doc.text(splitAddress, 20, currentY + 8)
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Generated by Kshitij NGO Student Management System', 105, pageHeight - 20, { align: 'center' })
  doc.text(`Report generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, pageHeight - 10, { align: 'center' })
  
  doc.save(`Kshitij_NGO_${student.name.replace(/\s+/g, '_')}_Profile.pdf`)
}

export const generateDashboardStatsPDF = (stats: any) => {
  const doc = new jsPDF()
  
  // NGO Header with branding
  doc.setFontSize(24)
  doc.setTextColor(0, 102, 204)
  doc.text('KSHITIJ NGO', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Student Sponsorship Program - Dashboard Report', 105, 28, { align: 'center' })
  
  // Divider line
  doc.setDrawColor(0, 102, 204)
  doc.line(20, 35, 190, 35)
  
  // Report Title
  doc.setFontSize(18)
  doc.setTextColor(0, 0, 0)
  doc.text('PROGRAM STATISTICS REPORT', 20, 50)
  
  // Summary Statistics
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('PROGRAM OVERVIEW', 20, 65)
  
  const overviewData = [
    ['Total Students Registered', (stats.totalStudents || 0).toString()],
    ['Applications Approved', (stats.approved || 0).toString()],
    ['Applications Pending Review', (stats.pending || 0).toString()],
    ['Applications Rejected', (stats.rejected || 0).toString()],
    ['Approval Rate', `${stats.totalStudents > 0 ? Math.round((stats.approved / stats.totalStudents) * 100) : 0}%`]
  ]
  
  autoTable(doc, {
    startY: 70,
    head: [['Metric', 'Value']],
    body: overviewData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 20, right: 20 }
  })
  
  // Financial Summary
  let currentY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.setTextColor(0, 102, 204)
  doc.text('FINANCIAL SUMMARY', 20, currentY)
  
  const financialData = [
    ['Total Funding Required', `Rs. ${(stats.totalFunding || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Average Family Income', `Rs. ${(stats.avgIncome || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
    ['Average Education Expenses', `Rs. ${stats.totalStudents > 0 ? Math.round((stats.totalFunding || 0) / stats.totalStudents).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}`],
    ['Funding Gap Analysis', stats.avgIncome > 0 && stats.totalFunding > 0 ? 
      `${Math.round(((stats.totalFunding / stats.totalStudents) / (stats.avgIncome / stats.totalStudents)) * 100)}% of family income` : 'N/A']
  ]
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Financial Metric', 'Amount/Percentage']],
    body: financialData,
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] },
    margin: { left: 20, right: 20 }
  })
  
  // Students List
  if (stats.students && stats.students.length > 0) {
    doc.addPage()
    
    // Header for second page
    doc.setFontSize(24)
    doc.setTextColor(0, 102, 204)
    doc.text('KSHITIJ NGO', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text('Student Sponsorship Program - Student Directory', 105, 28, { align: 'center' })
    
    doc.setDrawColor(0, 102, 204)
    doc.line(20, 35, 190, 35)
    
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('REGISTERED STUDENTS DIRECTORY', 20, 50)
    
    const studentData = stats.students.map((student: Student, index: number) => [
      (index + 1).toString(),
      student.name,
      `${student.age} yrs`,
      student.class,
      student.village,
      student.status.toUpperCase(),
      `Rs. ${student.totalExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    ])
    
    autoTable(doc, {
      startY: 60,
      head: [['S.No', 'Student Name', 'Age', 'Class', 'Village', 'Status', 'Expenses']],
      body: studentData,
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 204], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 40 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 }
      }
    })
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Generated by Kshitij NGO Student Management System', 105, pageHeight - 20, { align: 'center' })
    doc.text(`Report generated on: ${new Date().toLocaleDateString('en-IN')} | Page ${i} of ${pageCount}`, 105, pageHeight - 10, { align: 'center' })
  }
  
  doc.save(`Kshitij_NGO_Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`)
}