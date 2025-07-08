require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Import routes
const usersRouter = require('./routes/users');
const subcontractorsRouter = require('./routes/subcontractors');
const contractsRouter = require('./routes/contracts');
const workersRouter = require('./routes/workers');
const attendanceRouter = require('./routes/attendance');
const tasksRouter = require('./routes/tasks');
const materialsRouter = require('./routes/materials');
const materialTransactionsRouter = require('./routes/material_transactions');
const paymentsRouter = require('./routes/payments');
const wageReportsRouter = require('./routes/wage_reports');
const uploadsRouter = require('./routes/uploads');
const reportsRouter = require('./routes/reports');

// Use routes
app.use('/users', usersRouter);
app.use('/subcontractors', subcontractorsRouter);
app.use('/contracts', contractsRouter);
app.use('/workers', workersRouter);
app.use('/attendance', attendanceRouter);
app.use('/tasks', tasksRouter);
app.use('/materials', materialsRouter);
app.use('/material_transactions', materialTransactionsRouter);
app.use('/payments', paymentsRouter);
app.use('/wage_reports', wageReportsRouter);
app.use('/uploads', uploadsRouter);
const reportsRouter = require('./routes/reports');
const notificationsRouter = require('./routes/notifications');

app.use('/users', usersRouter);
app.use('/subcontractors', subcontractorsRouter);
app.use('/contracts', contractsRouter);
app.use('/workers', workersRouter);
app.use('/attendance', attendanceRouter);
app.use('/tasks', tasksRouter);
app.use('/materials', materialsRouter);
app.use('/material_transactions', materialTransactionsRouter);
app.use('/payments', paymentsRouter);
app.use('/wage_reports', wageReportsRouter);
app.use('/uploads', uploadsRouter);
app.use('/reports', reportsRouter);
app.use('/notifications', notificationsRouter);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});