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

app.use('/subcontractors', subcontractorsRouter);
app.use('/contracts', contractsRouter);
app.use('/workers', workersRouter);
app.use('/attendance', attendanceRouter);
