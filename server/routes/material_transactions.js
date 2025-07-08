const router = require('express').Router();
let MaterialTransaction = require('../models/material_transaction.model');
let Material = require('../models/material.model');
let Notification = require('../models/notification.model');
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
router.route('/add').post(auth, authorizeRoles('Storekeeper', 'Manager'), async (req, res) => {
  const { material, quantity, type, recordedBy, issuedTo, issuedToModel, notes, site } = req.body;

  const newMaterialTransaction = new MaterialTransaction({ material, quantity, type, recordedBy, issuedTo, issuedToModel, notes, site });

  try {
    await newMaterialTransaction.save();

    // Update material stock and check for low stock
    const material = await Material.findById(newMaterialTransaction.material);
    if (material) {
      if (newMaterialTransaction.type === 'in') {
        material.currentStock += newMaterialTransaction.quantity;
      } else if (newMaterialTransaction.type === 'out') {
        material.currentStock -= newMaterialTransaction.quantity;
      }
      await material.save();

      if (material.currentStock <= material.minStockLevel) {
        // Create a notification for low stock
        const newNotification = new Notification({
          recipient: req.user.id, // Assuming the storekeeper or manager should be notified
          message: `Material ${material.name} is running low! Current stock: ${material.currentStock} ${material.unit}. Minimum stock level: ${material.minStockLevel} ${material.unit}.`,
          type: 'material_low_stock'
        });
        await newNotification.save();
      }
    }

    res.json('Material transaction added and stock updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
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
      transaction.site = req.body.site;

      transaction.save()
        .then(() => res.json('Material transaction updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;