var express = require('express');
var router = express.Router();

/*--首页路由--*/
router.get('/', function (req, res, next) {
    Model('Article').find({}).populate('user').exec(function (err, articles) {
        res.render('index', {articles: articles});
    });
});

module.exports = router;