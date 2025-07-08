const router = require('express').Router();
let Subcontractor = require('../models/subcontractor.model');

// Get all subcontractors
router.route('/').get((req, res) => {
  Subcontractor.find()
    .then(subcontractors => res.json(subcontractors))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new subcontractor
router.route('/add').post((req, res) => {
  const newSubcontractor = new Subcontractor(req.body);

  newSubcontractor.save()
    .then(() => res.json('Subcontractor added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific subcontractor
router.route('/:id').get((req, res) => {
  Subcontractor.findById(req.params.id)
    .then(subcontractor => res.json(subcontractor))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a subcontractor
router.route('/update/:id').post((req, res) => {
  Subcontractor.findById(req.params.id)
    .then(subcontractor => {
      subcontractor.name = req.body.name;
      subcontractor.contactPerson = req.body.contactPerson;
      subcontractor.phone = req.body.phone;
      subcontractor.email = req.body.email;
      subcontractor.address = req.body.address;
      subcontractor.status = req.body.status;

      subcontractor.save()
        .then(() => res.json('Subcontractor updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
