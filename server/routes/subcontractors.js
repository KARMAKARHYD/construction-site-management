const router = require('express').Router();
let Subcontractor = require('../models/subcontractor.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all subcontractors
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper'), (req, res) => {
  Subcontractor.find()
    .then(subcontractors => res.json(subcontractors))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new subcontractor
router.route('/add').post(auth, authorizeRoles('Manager'), (req, res) => {
  const { user, name, contactPerson, phone, email, address, status, site } = req.body;

  const newSubcontractor = new Subcontractor({ user, name, contactPerson, phone, email, address, status, site });

  newSubcontractor.save()
    .then(() => res.json('Subcontractor added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific subcontractor
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor', 'Timekeeper', 'Subcontractor'), (req, res) => {
  Subcontractor.findById(req.params.id)
    .then(subcontractor => res.json(subcontractor))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a subcontractor
router.route('/update/:id').post(auth, authorizeRoles('Manager'), (req, res) => {
  Subcontractor.findById(req.params.id)
    .then(subcontractor => {
      subcontractor.name = req.body.name;
      subcontractor.contactPerson = req.body.contactPerson;
      subcontractor.phone = req.body.phone;
      subcontractor.email = req.body.email;
      subcontractor.address = req.body.address;
      subcontractor.status = req.body.status;
      subcontractor.site = req.body.site;

      subcontractor.save()
        .then(() => res.json('Subcontractor updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
