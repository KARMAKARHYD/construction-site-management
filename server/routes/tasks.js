const router = require('express').Router();
let Task = require('../models/task.model');
let Notification = require('../models/notification.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get all tasks
router.route('/').get(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor', 'Worker'), (req, res) => {
  Task.find()
    .populate('assignedTo', 'name') // Populate subcontractor name
    .populate('assignedBy', 'username') // Populate user who assigned the task
    .then(tasks => res.json(tasks))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new task
router.route('/add').post(auth, authorizeRoles('Manager', 'Supervisor'), async (req, res) => {
  const { title, description, assignedTo, assignedBy, dueDate, status, site } = req.body;

  const newTask = new Task({ title, description, assignedTo, assignedBy, dueDate, status, site });

  newTask.save()
    .then(async () => {
      // Create a notification for the assigned subcontractor
      const newNotification = new Notification({
        recipient: newTask.assignedTo,
        message: `You have been assigned a new task: ${newTask.title}`,
        type: 'task_assigned'
      });
      await newNotification.save();
      res.json('Task added and notification sent!');
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific task
router.route('/:id').get(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor', 'Worker'), (req, res) => {
  Task.findById(req.params.id)
    .populate('assignedTo', 'name')
    .populate('assignedBy', 'username')
    .then(task => res.json(task))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a task
router.route('/update/:id').post(auth, authorizeRoles('Manager', 'Supervisor', 'Subcontractor'), (req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      task.title = req.body.title;
      task.description = req.body.description;
      task.assignedTo = req.body.assignedTo;
      task.assignedBy = req.body.assignedBy;
      task.dueDate = req.body.dueDate;
      task.status = req.body.status;
      task.progressUpdates.push(req.body.progressUpdate);
      task.site = req.body.site;

      task.save()
        .then(() => res.json('Task updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
