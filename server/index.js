require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const usersRouter = require('./routes/users');

const subcontractorsRouter = require('./routes/subcontractors');
const contractsRouter = require('./routes/contracts');
const workersRouter = require('./routes/workers');
const attendanceRouter = require('./routes/attendance');
const tasksRouter = require('./routes/tasks');

app.use('/subcontractors', subcontractorsRouter);
app.use('/contracts', contractsRouter);
app.use('/workers', workersRouter);
app.use('/attendance', attendanceRouter);
const tasksRouter = require('./routes/tasks');
const materialsRouter = require('./routes/materials');
const materialTransactionsRouter = require('./routes/material_transactions');

app.use('/subcontractors', subcontractorsRouter);
app.use('/contracts', contractsRouter);
app.use('/workers', workersRouter);
app.use('/attendance', attendanceRouter);
app.use('/tasks', tasksRouter);
app.use('/materials', materialsRouter);
const materialTransactionsRouter = require('./routes/material_transactions');
const paymentsRouter = require('./routes/payments');
const wageReportsRouter = require('./routes/wage_reports');

app.use('/subcontractors', subcontractorsRouter);
app.use('/contracts', contractsRouter);
app.use('/workers', workersRouter);
app.use('/attendance', attendanceRouter);
app.use('/tasks', tasksRouter);
app.use('/materials', materialsRouter);
app.use('/material_transactions', materialTransactionsRouter);
app.use('/payments', paymentsRouter);
app.use('/wage_reports', wageReportsRouter);
