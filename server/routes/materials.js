const router = require('express').Router();
let Material = require('../models/material.model');

// Get all materials
router.route('/').get((req, res) => {
  Material.find()
    .then(materials => res.json(materials))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new material
router.route('/add').post((req, res) => {
  const newMaterial = new Material(req.body);

  newMaterial.save()
    .then(() => res.json('Material added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific material
router.route('/:id').get((req, res) => {
  Material.findById(req.params.id)
    .then(material => res.json(material))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a material
router.route('/update/:id').post((req, res) => {
  Material.findById(req.params.id)
    .then(material => {
      material.name = req.body.name;
      material.unit = req.body.unit;
      material.currentStock = req.body.currentStock;
      material.minStockLevel = req.body.minStockLevel;

      material.save()
        .then(() => res.json('Material updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
