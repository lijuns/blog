var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

//注册页面
router.get('/reg', middleware.checkNotLogin, function (req, res) {
    res.render('user/reg', {});
});

//提交注册
router.post('/reg', middleware.checkNotLogin, function (req, res) {
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
router.get('/login', middleware.checkNotLogin, function (req, res) {
    if (req.session.user) {  //权限控制，已经登录过了
        req.flash('error', '您已登录，不能重复登录~');
        res.redirect('back');   //跳转到上一个页面
    } else {
        res.render('user/login', {});
    }
});

//提交登录
router.post('/login',middleware.checkNotLogin, function (req, res) {
    var user = req.body;
    Model('User').findOne(user, function (err, doc) {
        if (!doc) {
            req.flash('error', '用户不存在');
            return res.redirect('/users/login');
        }

        if (doc.password != req.body.password) {

            req.flash('error', '密码错误');
            return res.redirect('/users/login');
        }

        req.session.user = doc;

        req.flash('success', '登录成功');
        res.redirect('/');

    });
});

//退出
router.get('/logout',middleware.checkLogin, function (req, res) {
    req.flash('success', '退出成功');
    req.session.user = null;
    res.redirect('/users/login');
});

module.exports = router;
