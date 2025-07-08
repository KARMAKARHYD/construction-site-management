const router = require('express').Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Payment = require('../models/payment.model');
const WageReport = require('../models/wage_report.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Generate PDF for Payments
router.get('/payments/pdf', auth, authorizeRoles('Manager', 'Timekeeper'), async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('subcontractor', 'name')
      .populate('contract', 'contractType');

    const doc = new PDFDocument();
    let filename = 'payments_report.pdf';
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(25).text('Payments Report', { align: 'center' });
    doc.moveDown();

    payments.forEach(payment => {
      doc.fontSize(12).text(`Subcontractor: ${payment.subcontractor ? payment.subcontractor.name : 'N/A'}`);
      doc.text(`Contract Type: ${payment.contract ? payment.contract.contractType : 'N/A'}`);
      doc.text(`Amount: ${payment.amount}`);
      doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);
      doc.text(`Payment Type: ${payment.paymentType}`);
      doc.text(`Notes: ${payment.notes || 'N/A'}`);
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    res.status(500).json('Error generating PDF: ' + err);
  }
});

// Generate Excel for Wage Reports
router.get('/wage_reports/excel', auth, authorizeRoles('Manager', 'Timekeeper'), async (req, res) => {
  try {
    const wageReports = await WageReport.find()
      .populate('worker', 'name')
      .populate('subcontractor', 'name');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Wage Reports');

    worksheet.columns = [
      { header: 'Worker', key: 'workerName', width: 20 },
      { header: 'Subcontractor', key: 'subcontractorName', width: 20 },
      { header: 'From Date', key: 'dateFrom', width: 15 },
      { header: 'To Date', key: 'dateTo', width: 15 },
      { header: 'Total Hours', key: 'totalHours', width: 15 },
      { header: 'Overtime Hours', key: 'totalOvertimeHours', width: 15 },
      { header: 'Total Wage', key: 'totalWage', width: 15 },
      { header: 'Advances', key: 'advances', width: 10 },
      { header: 'Net Pay', key: 'netPay', width: 15 },
      { header: 'Status', key: 'status', width: 10 }
    ];

    wageReports.forEach(report => {
      worksheet.addRow({
        workerName: report.worker ? report.worker.name : 'N/A',
        subcontractorName: report.subcontractor ? report.subcontractor.name : 'N/A',
        dateFrom: new Date(report.dateFrom).toLocaleDateString(),
        dateTo: new Date(report.dateTo).toLocaleDateString(),
        totalHours: report.totalHours,
        totalOvertimeHours: report.totalOvertimeHours,
        totalWage: report.totalWage,
        advances: report.advances,
        netPay: report.netPay,
        status: report.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="wage_reports.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json('Error generating Excel: ' + err);
  }
});

module.exports = router;
