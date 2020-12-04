var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var databaseRouter = require('./routes/database');

var app = express();

// Session Variable Middleware must be "used" before any routes are
// declared/connected to the app.
app.use(session({
  secret: 'CS6314-TableTopStoreProject',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create session variables if it does not already exist
app.use((req, res, next) => {
   // Check if we've already initialised a session
   if (req.session.user_info === undefined) {
      req.session.user_info = {};
   }
   next();
});

// Routes
app.use('/', indexRouter);
app.use('/database', databaseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.use(session({
//   secret: 'CS6314-TableTopStoreProject'
// }));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
