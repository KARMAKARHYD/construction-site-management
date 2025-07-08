const router = require('express').Router();
let Notification = require('../models/notification.model');
const { auth, authorizeRoles } = require('../middleware/auth');

// Get notifications for the authenticated user
router.route('/').get(auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Mark a notification as read
router.route('/read/:id').post(auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    notification.read = true;
    await notification.save();
    res.json('Notification marked as read!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
