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
var test = require('./routes/test');
var pin = require('./routes/pin');
var user = require('./routes/user');

app.use(session({
  secret: 'sdfad43f-df43jkn-3j534jkh-n34bkj5',
  cookie: { maxAge: 2628000000 },
  resave: false,
  saveUninitialized: true
}));

// serve index.html on request to '/'
app.use(serveStatic(path.join(__dirname, 'views'), {
  'index': 'index.html'
}));

// serve error pages
app.use('/error404', serveStatic(path.join(__dirname, 'views'), {
  'index': 'error404.html'
}));
app.use('/error', serveStatic(path.join(__dirname, 'views'), {
  'index': 'error.html'
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// handle routes
app.use('/', index);
app.use('/test', test);
app.use('/pin', pin);
app.use('/user', user);

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
