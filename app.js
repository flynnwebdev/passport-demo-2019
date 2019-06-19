var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')
const secure = require('./middleware/secure')
const acl = require('express-acl')
const {
  UserModel
} = require('./models/user')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/dashboard');

var app = express();

acl.config({
  filename: 'acl.yml',
  defaultRole: 'guest',
  denyCallback: (res) => {
    res.status(403).json({
      status: 'Verboten!',
      success: false,
      message: 'You are not authorized to do that!'
    })
  }
})

app.use(session({
  secret: "These are not the droids you're looking for"
}))

// NB: Put this after session!
app.use(acl.authorize)

mongoose.connect('mongodb://localhost/passport-demo', err => {
  if (err) {
    console.log('Error connecting to db: ', err)
  } else {
    console.log('Connected to db')
  }
})

passport.use(UserModel.createStrategy())
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', secure, adminRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;