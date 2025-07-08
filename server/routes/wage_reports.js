const router = require('express').Router();
let WageReport = require('../models/wage_report.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all wage reports
router.route('/').get(auth, authorizeRoles('Manager', 'Timekeeper'), (req, res) => {
  WageReport.find()
    .populate('worker', 'name')
    .populate('subcontractor', 'name')
    .then(reports => res.json(reports))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new wage report
router.route('/add').post(auth, authorizeRoles('Manager', 'Timekeeper'), (req, res) => {
  const { worker, subcontractor, dateFrom, dateTo, totalHours, totalOvertimeHours, totalWage, advances, netPay, status, site } = req.body;

  const newWageReport = new WageReport({ worker, subcontractor, dateFrom, dateTo, totalHours, totalOvertimeHours, totalWage, advances, netPay, status, site });

  newWageReport.save()
    .then(() => res.json('Wage report added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific wage report
router.route('/:id').get(auth, authorizeRoles('Manager', 'Timekeeper', 'Worker'), (req, res) => {
  WageReport.findById(req.params.id)
    .populate('worker', 'name')
    .populate('subcontractor', 'name')
    .then(report => res.json(report))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a wage report
router.route('/update/:id').post(auth, authorizeRoles('Manager', 'Timekeeper'), (req, res) => {
  WageReport.findById(req.params.id)
    .then(report => {
      report.worker = req.body.worker;
      report.subcontractor = req.body.subcontractor;
      report.dateFrom = req.body.dateFrom;
      report.dateTo = req.body.dateTo;
      report.totalHours = req.body.totalHours;
      report.totalOvertimeHours = req.body.totalOvertimeHours;
      report.totalWage = req.body.totalWage;
      report.advances = req.body.advances;
      report.netPay = req.body.netPay;
      report.status = req.body.status;
      report.site = req.body.site;

      report.save()
        .then(() => res.json('Wage report updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
