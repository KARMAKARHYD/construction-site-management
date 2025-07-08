const router = require('express').Router();
let Attendance = require('../models/attendance.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all attendance records
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper', 'Subcontractor', 'Worker'), (req, res) => {
  Attendance.find()
    .then(attendance => res.json(attendance))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new attendance record
router.route('/add').post(auth, authorizeRoles('Timekeeper', 'Subcontractor', 'Worker'), (req, res) => {
  const newAttendance = new Attendance(req.body);

  newAttendance.save()
    .then(() => res.json('Attendance added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific attendance record
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper', 'Subcontractor', 'Worker'), (req, res) => {
  Attendance.findById(req.params.id)
    .then(attendance => res.json(attendance))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update an attendance record
router.route('/update/:id').post(auth, authorizeRoles('Timekeeper', 'Subcontractor', 'Worker'), (req, res) => {
  Attendance.findById(req.params.id)
    .then(attendance => {
      attendance.worker = req.body.worker;
      attendance.subcontractor = req.body.subcontractor;
      attendance.date = req.body.date;
      attendance.status = req.body.status;
      attendance.overtimeHours = req.body.overtimeHours;

      attendance.save()
        .then(() => res.json('Attendance updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
