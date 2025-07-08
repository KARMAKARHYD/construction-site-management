const router = require('express').Router();
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  }
});

// Create the multer instance
const upload = multer({ storage: storage });

// Route for uploading a single file
router.post('/single', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

// Route for uploading multiple files
router.post('/multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  const filePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.send({ filePaths });
});

module.exports = router;
