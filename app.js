process.on('uncaughtException', function(e) {
	console.log(e);
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var passport = exports.passport = require('passport');

//var routes = require('./routes/index');
//var users = require('./routes/user');

var mongoose = require('mongoose');
//SACAR CUANDO TERMINE (VA EN TESTS)
var fixtures = require('mongoose-fixtures');
mongoose.connect('mongodb://localhost/nodejs-tp-final-2016');

//SACAR CUANDO TERMINE
fixtures.load('./test/fixtures/admins.js');
fixtures.load('./test/fixtures/employees.js');

var app = exports.app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'supersecret', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./auth/local-strategy.js');

//app.use('/', routes);
//app.use('/users', users);

require('./routes/main.js');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
