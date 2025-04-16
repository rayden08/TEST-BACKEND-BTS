require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');

const indexRouter = require('./routes/index');


const apiRouters = require('./routes/apiRoutes.js');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', indexRouter);
app.use('/api', apiRouters);




app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
 
  if (res.headersSent) {
    return next(err);
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send({
    status: "error",
    message: err.message,
    code: err.status || 500,
    data: null
  });
});


module.exports = app;