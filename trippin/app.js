var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var session = require('express-session');

var app = express();

var db = require('./db/db.js');

// import route files
var index = require('./routes/index');
var pin = require('./routes/pin');
var login = require('./routes/login');

// create session
app.use(session({
  secret: 'LjPe33XGTnq3FqzxSHigL_uy',
  cookie: { maxAge: 2628000000 },
  resave: false,
  saveUninitialized: true
}));

// check for login and redirect to login page if not logged in
app.get('/', function(req, res, next) {
  console.log(req.session._id);
  if (!req.session._id) {
    res.redirect('/login');
  } else {
    next();
  }
});

// serve /views/index.html on request to '/'
app.use(serveStatic(path.join(__dirname, 'views'), {
  'index': 'index.html'
}));

// serve /views/login.html on request to '/login'
app.use('/login', serveStatic(path.join(__dirname, 'views'), {
  'index': 'login.html'
}));

// serve error pages
app.use('/error404', serveStatic(path.join(__dirname, 'views'), {
  'index': 'error404.html'
}));
app.use('/error', serveStatic(path.join(__dirname, 'views'), {
  'index': 'error.html'
}));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic(path.join(__dirname, 'public')));

// handle routes
app.use('/', index);
app.use('/pin', pin);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  // redirect to error pages
  if (err.status === 404) {
    res.redirect('/error404');
  } else {
    res.redirect('/error');
  }
});

module.exports = app;
