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

//文章详细
router.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    Model('Article').findById(id, function (err, article) {
        res.render('article/detail', {article: article});
    });
});

//删除文章
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

//编辑文章
router.get('/edit/:id', function (req, res) {
    var id = req.params.id;
    Model('Article').findById(id, function (err, article) {
        res.render('article/add', {article: article});
    })
});

//文章搜索
router.get('/list/:pageNum/:pageSize', function (req, res) {
    var keyword = req.query.keyword;
    var pageSize = Number(req.params.pageSize);
    var pageNum = Number(req.params.pageNum);
    var query = new RegExp(keyword, 'i');
    Model('Article').count({$or: [{title: query}, {content: query}]}, function (err, count) {
        var totalPage = Math.ceil(count / pageSize);
        pageNum = pageNum <= 0 ? 1 : pageNum;
        pageNum = pageNum >= totalPage ? totalPage : pageNum;
        if (err) {
            console.log(err);
        } else {
            Model('Article').find({$or: [{title: query}, {content: query}]})
                .skip((pageNum - 1) * pageSize)
                .limit(pageSize)
                .exec(function (err, articles) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('index', {
                            title: '主页',
                            pageNum: pageNum,
                            pageSize: pageSize,
                            keyword: keyword,
                            totalPage: totalPage,
                            articles: articles
                        });
                    }
                });
        }
    });
});
module.exports = router;
