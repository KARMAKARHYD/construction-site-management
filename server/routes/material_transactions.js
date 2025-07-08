const router = require('express').Router();
let MaterialTransaction = require('../models/material_transaction.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all material transactions
router.route('/').get(auth, authorizeRoles('Storekeeper', 'Manager', 'Supervisor'), (req, res) => {
  MaterialTransaction.find()
    .populate('material', 'name unit')
    .populate('recordedBy', 'username')
    .populate('issuedTo', 'name')
    .then(transactions => res.json(transactions))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new material transaction
router.route('/add').post(auth, authorizeRoles('Storekeeper', 'Manager'), (req, res) => {
  const newMaterialTransaction = new MaterialTransaction(req.body);

  newMaterialTransaction.save()
    .then(() => res.json('Material transaction added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific material transaction
router.route('/:id').get(auth, authorizeRoles('Storekeeper', 'Manager', 'Supervisor'), (req, res) => {
  MaterialTransaction.findById(req.params.id)
    .populate('material', 'name unit')
    .populate('recordedBy', 'username')
    .populate('issuedTo', 'name')
    .then(transaction => res.json(transaction))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a material transaction
router.route('/update/:id').post(auth, authorizeRoles('Storekeeper', 'Manager'), (req, res) => {
  MaterialTransaction.findById(req.params.id)
    .then(transaction => {
      transaction.material = req.body.material;
      transaction.quantity = req.body.quantity;
      transaction.type = req.body.type;
      transaction.date = req.body.date;
      transaction.recordedBy = req.body.recordedBy;
      transaction.issuedTo = req.body.issuedTo;
      transaction.issuedToModel = req.body.issuedToModel;
      transaction.notes = req.body.notes;

      transaction.save()
        .then(() => res.json('Material transaction updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
