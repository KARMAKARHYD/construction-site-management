const router = require('express').Router();
let Worker = require('../models/worker.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all workers
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper', 'Subcontractor'), async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'Manager' && req.user.site) {
      filter.site = req.user.site;
    }
    if (req.query.siteId) {
      filter.site = req.query.siteId;
    }
    const workers = await Worker.find(filter);
    res.json(workers);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add a new worker
router.route('/add').post(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor'), (req, res) => {
  const { subcontractor, name, phone, dailyWage, status, site } = req.body;

  const newWorker = new Worker({ subcontractor, name, phone, dailyWage, status, site });

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
      worker.site = req.body.site;

      worker.save()
        .then(() => res.json('Worker updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
