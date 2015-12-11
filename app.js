var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); //favicon
var logger = require('morgan'); //日志文件
var cookieParser = require('cookie-parser');  //解析cookie  req.cookie
var bodyParser = require('body-parser');  //解析form、json字段 req.body

var routes = require('./routes/index'); //index路由设置
var users = require('./routes/users');  //user路由设置
var articles = require('./routes/articles');    //articles 路由设置
var session = require('express-session');   //会话模块  req.session
var mongoStore = require('connect-mongo')(session); //依赖session模块，用于将session储存到数据库中
var flash = require('connect-flash');

var app = express();
require('./db/register');

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
app.use(session({
    name: 'connect_id',  //保存session的字段名称，默认为connect_id
    secret: 'infonx',  //通过设置的secret字符串，来计算hash值，并放在cookie中
    cookie: {maxAge: 60 * 1000 * 30},   //设置存放session_id的cookie的相关选项，默认为(default:{path:'/',httpOnly:true,secure:false,maxAge:null});
    resave: true, //true 即使session 没有修改服务器也每次都保存
    saveUninitialized: true, // 最后的两个参数必须设置，否则会报错

    store: new mongoStore({  //使用connect-mongo之后，session参数中必须添加该参数
        url: 'mongodb://127.0.0.1/blog',

    })
})); //引用session模块

//使用消息控制中间件
app.use(flash());   //req.flash();

//处理公共变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    //res.locals.success = req.session.success;
    res.locals.success = req.flash('success').toString();  //req.flash的取值差异
    res.locals.error = req.flash('error').toString();

    next();
});

app.use('/', routes);   //根据用户调用的路径不同，启用不同的路由
app.use('/users', users);
app.use('/articles', articles);

//catch 404 and forward to error handler   捕捉404错误 并发送到错误处理中间件
// 错误处理中间件和普通中间件的区别在于错误中间件多了一个error 参数
app.use(function (req, res, next) { //错误页面捕获解析
    var err = new Error('Not Found');
    err.status = 404;
    next(err);  //next中如果传了参数表示出错了
});


// error handlers
// development error handler
// will print stacktrace    打印堆栈信息
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
// no stacktrace leaked to user 不向用户暴露堆栈信息
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;   //导出app供 bin/www 使用