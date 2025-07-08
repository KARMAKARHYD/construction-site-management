const router = require('express').Router();
let Worker = require('../models/worker.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all workers
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper', 'Subcontractor'), (req, res) => {
  Worker.find()
    .then(workers => res.json(workers))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new worker
router.route('/add').post(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor'), (req, res) => {
  const newWorker = new Worker(req.body);

  newWorker.save()
    .then(() => res.json('Worker added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific worker
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper', 'Subcontractor', 'Worker'), (req, res) => {
  Worker.findById(req.params.id)
    .then(worker => res.json(worker))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a worker
router.route('/update/:id').post(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor'), (req, res) => {
  Worker.findById(req.params.id)
    .then(worker => {
      worker.subcontractor = req.body.subcontractor;
      worker.name = req.body.name;
      worker.phone = req.body.phone;
      worker.dailyWage = req.body.dailyWage;
      worker.status = req.body.status;

      worker.save()
        .then(() => res.json('Worker updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
