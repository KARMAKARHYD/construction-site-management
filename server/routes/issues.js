const router = require('express').Router();
let Issue = require('../models/issue.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all issues
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor'), (req, res) => {
  const filter = req.query.siteId ? { site: req.query.siteId } : {};
  Issue.find(filter)
    .populate('reportedBy', 'username')
    .populate('assignedTo', 'username')
    .populate('site', 'name')
    .then(issues => res.json(issues))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new issue
router.route('/add').post(auth, authorizeRoles('Supervisor', 'Manager'), (req, res) => {
  const newIssue = new Issue(req.body);

  newIssue.save()
    .then(() => res.json('Issue added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific issue
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor'), (req, res) => {
  Issue.findById(req.params.id)
    .populate('reportedBy', 'username')
    .populate('assignedTo', 'username')
    .populate('site', 'name')
    .then(issue => res.json(issue))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update an issue
router.route('/update/:id').post(auth, authorizeRoles('Manager', 'Supervisor'), (req, res) => {
  Issue.findById(req.params.id)
    .then(issue => {
      issue.title = req.body.title;
      issue.description = req.body.description;
      issue.reportedBy = req.body.reportedBy;
      issue.assignedTo = req.body.assignedTo;
      issue.status = req.body.status;
      issue.priority = req.body.priority;
      issue.site = req.body.site;

      issue.save()
        .then(() => res.json('Issue updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
