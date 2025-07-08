const router = require('express').Router();
let Payment = require('../models/payment.model');

// Get all payments
router.route('/').get((req, res) => {
  Payment.find()
    .populate('subcontractor', 'name')
    .populate('contract', 'contractType')
    .then(payments => res.json(payments))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new payment
router.route('/add').post((req, res) => {
  const newPayment = new Payment(req.body);

  newPayment.save()
    .then(() => res.json('Payment added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific payment
router.route('/:id').get((req, res) => {
  Payment.findById(req.params.id)
    .populate('subcontractor', 'name')
    .populate('contract', 'contractType')
    .then(payment => res.json(payment))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a payment
router.route('/update/:id').post((req, res) => {
  Payment.findById(req.params.id)
    .then(payment => {
      payment.subcontractor = req.body.subcontractor;
      payment.contract = req.body.contract;
      payment.amount = req.body.amount;
      payment.paymentDate = req.body.paymentDate;
      payment.paymentType = req.body.paymentType;
      payment.notes = req.body.notes;

      payment.save()
        .then(() => res.json('Payment updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
