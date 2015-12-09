var express = require('express');
var router = express.Router();

//注册页面
router.get('/reg', function (req, res) {
    res.send('注册');
});

//提交注册
router.post('/reg', function (req, res) {
    res.render('user/reg', {title: '注册页面'});
});

//登录页面
router.get('/login', function (req, res) {
    res.send('登录页面');
});

//提交登录
router.post('/login', function (req, res) {
    res.send('提交登录');
});

//退出
router.get('/logout', function (req, res) {
    res.send('退出登录');
});

module.exports = router;
