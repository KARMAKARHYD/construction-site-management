const router = require('express').Router();
let Task = require('../models/task.model');

// Get all tasks
router.route('/').get((req, res) => {
  Task.find()
    .populate('assignedTo', 'name') // Populate subcontractor name
    .populate('assignedBy', 'username') // Populate user who assigned the task
    .then(tasks => res.json(tasks))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new task
router.route('/add').post((req, res) => {
  const newTask = new Task(req.body);

  newTask.save()
    .then(() => res.json('Task added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a specific task
router.route('/:id').get((req, res) => {
  Task.findById(req.params.id)
    .populate('assignedTo', 'name')
    .populate('assignedBy', 'username')
    .then(task => res.json(task))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a task
router.route('/update/:id').post((req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      task.title = req.body.title;
      task.description = req.body.description;
      task.assignedTo = req.body.assignedTo;
      task.assignedBy = req.body.assignedBy;
      task.dueDate = req.body.dueDate;
      task.status = req.body.status;
      task.progressUpdates = req.body.progressUpdates;

      task.save()
        .then(() => res.json('Task updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
