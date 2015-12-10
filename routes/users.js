var express = require('express');
var router = express.Router();

//注册页面
router.get('/reg', function (req, res) {
    res.render('user/reg', {});
});

//提交注册
router.post('/reg', function (req, res) {
    var user = req.body;
    new Model('User')(user).save(function (err, user) { //提交表单一定要注意form表单加上name属性
        if (err) {
            console.log('数据库保存出错：' + err);
            res.redirect('/users/reg'); //redirect必须使用完整路径
        } else {
            res.redirect('/users/login');
        }
    })
});

//登录页面
router.get('/login', function (req, res) {
    res.render('user/login', {});
});

//提交登录
router.post('/login', function (req, res) {
    var user = req.body;
    console.log(Model('User').findOne(user));
    Model('User').findOne(user, function (err, doc) {
        if (doc) {  //doc有值表示登录成功
            res.redirect('/');
        } else {
            res.redirect('/users/login');
        }
    });
});

//退出
router.get('/logout', function (req, res) {
    res.render('user/logout', {});
});

module.exports = router;
