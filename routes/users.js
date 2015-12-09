var express = require('express');
var router = express.Router();

//注册页面
router.get('/reg', function (req, res) {
    res.render('user/reg', {});
});

//提交注册
router.post('/reg', function (req, res) {
    var user = req.body;    //读取用户提交的表单

});

//登录页面
router.get('/login', function (req, res) {
    res.render('user/login', {});
});

//提交登录
router.post('/login', function (req, res) {
    res.render('user/login', {});
});

//退出
router.get('/logout', function (req, res) {
    res.render('user/logout', {});
});

module.exports = router;
