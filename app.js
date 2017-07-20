var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var localsterategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var sesstion = require('express-session');
var passport = require('passport');
var multer = require('multer');
var flash = require('connect-flash');
var dbm = require('monk')('localhost/nodeauth');

var mongo = require('mongodb');
var mongoose = require('mongoose');
 var db = mongoose.connection;

var users = require('./routes/users');
var index = require('./routes/index');
var about = require('./routes/about');
var contact = require('./routes/contact');
var dashBoard = require('./routes/dashboard');
var posts = require('./routes/posts');
var categories = require('./routes/categories');


var moment = require('moment');
var app = express();
// lets care about body text // short them B)
app.locals.moment = require('moment');
// here ofcourse :|
// app.locals.substrText = function (text,  length) {
//         var substredText  = text.substring(0, length);
//         return substredText;
// };

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Upload File Upload
app.use(multer({dest: 'public/images/uploads'}).single('mainimage'));
//app.use(multer({dest: 'public/images/uploads'}).single('profileimage'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//Handel Express Sesstions
app.use(sesstion({
    secret: '$%#^%^R&!@T&^T&^T#&!&dg23',
    saveUninitialized: true,
    resave: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Flash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//make our db accessible to our router
app.use(function (req, resp, next) {
    req.db = dbm;
    next();
});

app.get('*',function (req, resp, next) {
     resp.locals.user = req.user || null;
     next();
});

app.use('/', index);
app.use('/users', users);
app.use('/about', about);
app.use('/contact', contact);
//app.set('views', path.join(__dirname, './views/dashboard'));
app.use('/dashboard',dashBoard);
app.use('/posts',posts);
app.use('/categories',categories);

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
  res.render('error');
});

module.exports = app;
