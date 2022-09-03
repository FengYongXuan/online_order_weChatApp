var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var customerRouter = require('./routes/customer')
var menuRouter = require('./routes/menu')
var adminRouter = require('./routes/admin')
var orderRouter = require('./routes/order')

var app = express();

// 视图引擎(view engine)设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// morgan中间件，记录日志，可将请求信息打印在控制台
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // 判断请求体是不是json，不是的话把请求体转化为对象
app.use(cookieParser());
// 配置静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

//匹配路由
app.use('/', indexRouter);
app.use('/customer', customerRouter);
app.use('/menu', menuRouter);
app.use('/admin', adminRouter);
app.use('/order', orderRouter);

// 捕获404错误，并将控制权交给下一个中间件createError
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理器(error handler)
app.use(function(err, req, res, next) {
  // 设置locals, 仅在开发时提供错误
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
