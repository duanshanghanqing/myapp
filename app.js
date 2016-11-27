var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");

//项目模块
// var home = require('./routes/home');
// var users = require('./routes/users');
// var articles = require('./routes/articles');
var app = express();

//session
var settings = require('./settings');
var session = require('express-session');
/*
app.use(session({
    secret:  settings.cookieSecret,//secret 用来防止篡改 cookie
    key: 'sid',
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: null ,maxAge: 60 * 1000 * 30 },
    resave: false,
    saveUninitialized: true
}));
*/

/*
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie
    key: settings.db,//key 的值为 cookie 的名字
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天
    resave:true,
    saveUninitialized:true,
    store: new MongoStore({
      url: settings.url,
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default 
    })
}));
*/


var redis   = require("redis");
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();
app.use(session({
    secret :  settings.cookieSecret,    
    store : new redisStore({ host: settings.host, port : 6379, client : client}) ,
    saveUninitialized : false ,
    resave : false
})) ;


//静态资源路径配置
app.use(function(req, res, next) {
    res.locals.staticResources = settings.staticResources;
    next();
});

// view engine setup
/*
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/
//ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
var accessLog = fs.createWriteStream(path.join(__dirname, "logs/access.log"), { flags: "a" });
app.use(logger("combined", { stream: accessLog }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', home);
// app.use('/users', users);
// app.use('/articles', articles);
require('./routes/index')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
