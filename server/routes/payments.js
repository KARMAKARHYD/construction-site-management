const router = require('express').Router();
let Payment = require('../models/payment.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all payments
router.route('/').get(auth, authorizeRoles('Manager', 'Timekeeper'), (req, res) => {
  Payment.find()
    .populate('subcontractor', 'name')
    .populate('contract', 'contractType')
    .then(payments => res.json(payments))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new payment
router.route('/add').post(auth, authorizeRoles('Manager', 'Timekeeper'), (req, res) => {
  const { subcontractor, contract, amount, paymentDate, paymentType, notes, site } = req.body;

  const newPayment = new Payment({ subcontractor, contract, amount, paymentDate, paymentType, notes, site });

  newPayment.save()
    .then(() => res.json('Payment added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific payment
router.route('/:id').get(auth, authorizeRoles('Manager', 'Timekeeper', 'Subcontractor'), (req, res) => {
  Payment.findById(req.params.id)
    .populate('subcontractor', 'name')
    .populate('contract', 'contractType')
    .then(payment => res.json(payment))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a payment
router.route('/update/:id').post(auth, authorizeRoles('Manager', 'Timekeeper'), (req, res) => {
  Payment.findById(req.params.id)
    .then(payment => {
      payment.subcontractor = req.body.subcontractor;
      payment.contract = req.body.contract;
      payment.amount = req.body.amount;
      payment.paymentDate = req.body.paymentDate;
      payment.paymentType = req.body.paymentType;
      payment.notes = req.body.notes;
      payment.site = req.body.site;

      payment.save()
        .then(() => res.json('Payment updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
