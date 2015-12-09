var express = require('express');
var router = express.Router();

//当用户访问 /add时 渲染该模板
router.get('/add', function (req, res) {
    res.render('article/add',{});
});

router.post('/add', function (req, res) {
    res.render('article/add',{});
});

module.exports = router;
