var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); //favicon
var logger = require('morgan'); //日志文件
var cookieParser = require('cookie-parser');  //解析cookie  req.cookie
var bodyParser = require('body-parser');  //解析form、json字段 req.body

var routes = require('./routes/index'); //index路由设置
var users = require('./routes/users');  //user路由设置
var articles = require('./routes/articles');    //articles 路由设置

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));  //设置模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //日志输出格式，配置为dev ,详细查看morgan API文档

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());    //取值 req.headers.cookie->username=tyh;password=1223;(querystring 转换) -> req.cookie;
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);   //根据用户调用的路径不同，启用不同的路由
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler   捕捉404错误 并发送到错误处理中间件
// 错误处理中间件和普通中间件的区别在于错误中间件多了一个error 参数
app.use(function (req, res, next) { //错误页面捕获解析
    var err = new Error('Not Found');
    err.status = 404;
    next(err);  //next中如果传了参数表示出错了
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktrace leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;