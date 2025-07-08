const router = require('express').Router();
let Site = require('../models/site.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all sites
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor'), (req, res) => {
  Site.find()
    .populate('manager', 'username')
    .then(sites => res.json(sites))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new site
router.route('/add').post(auth, authorizeRoles('Manager'), (req, res) => {
  const newSite = new Site(req.body);

  newSite.save()
    .then(() => res.json('Site added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific site
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor'), (req, res) => {
  Site.findById(req.params.id)
    .populate('manager', 'username')
    .then(site => res.json(site))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a site
router.route('/update/:id').post(auth, authorizeRoles('Manager'), (req, res) => {
  Site.findById(req.params.id)
    .then(site => {
      site.name = req.body.name;
      site.location = req.body.location;
      site.manager = req.body.manager;
      site.status = req.body.status;

      site.save()
        .then(() => res.json('Site updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
