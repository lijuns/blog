var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var multer = require('multer'); // 文件上传的模块
var path = require('path');

//当用户访问 /add时 渲染该模板
router.get('/add', middleware.checkLogin, function (req, res) {
    res.render('article/add', {article: {}});
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/upload');    //指定文件上传的路径
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({storage: storage});

router.post('/add', upload.single('poster'), middleware.checkLogin, function (req, res) {
    var article = req.body;
    var id = article.id;
    if (id) {   //有id更新该篇文章
        var updateObj = {
            title: article.title,
            content: article.content
        };
        req.file && (updateObj.poster = path.join('/upload', req.file.filename));
        new Model('Article').update({_id: id}, {$set: updateObj}, function (err) {
            if (err) {
                res.redirect('back');
            } else {
                res.redirect('/articles/detail/' + id);
            }
        });
    } else {
        article.user = req.session.user._id;
        article.poster = path.join('/upload', req.file.filename);
        new Model('Article')(article).save(function (err, doc) {
            if (doc) {
                res.redirect('/');
            } else {
                res.redirect('back');
            }
        });
    }

});

router.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    Model('Article').findById(id, function (err, article) {
        res.render('article/detail', {article: article});
    });
});

router.get('/detail/edit/:id', function (req, res) {
    var id = req.params.id;
    Model('Article').findById(id, function (err, article) {

    })
});

router.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    Model('Article').remove({_id: id}, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
});

router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    Model('Article').findById(id, function (err, article) {
        res.render('article/add', {article: article});
    })
});

module.exports = router;
