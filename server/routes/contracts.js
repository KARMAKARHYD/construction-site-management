const router = require('express').Router();
let Contract = require('../models/contract.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all contracts
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor'), (req, res) => {
  const filter = req.query.siteId ? { site: req.query.siteId } : {};
  Contract.find(filter)
    .then(contracts => res.json(contracts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new contract
router.route('/add').post(auth, authorizeRoles('Manager'), (req, res) => {
  const { subcontractor, contractType, rate, startDate, endDate, milestones, status, site } = req.body;

  const newContract = new Contract({ subcontractor, contractType, rate, startDate, endDate, milestones, status, site });

  newContract.save()
    .then(() => res.json('Contract added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific contract
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor'), (req, res) => {
  Contract.findById(req.params.id)
    .then(contract => res.json(contract))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a contract
router.route('/update/:id').post(auth, authorizeRoles('Manager'), (req, res) => {
  Contract.findById(req.params.id)
    .then(contract => {
      contract.subcontractor = req.body.subcontractor;
      contract.contractType = req.body.contractType;
      contract.rate = req.body.rate;
      contract.startDate = req.body.startDate;
      contract.endDate = req.body.endDate;
      contract.milestones = req.body.milestones;
      contract.status = req.body.status;
      contract.site = req.body.site;

      contract.save()
        .then(() => res.json('Contract updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
