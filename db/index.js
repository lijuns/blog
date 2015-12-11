var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1/blog');

db.connection.on('error', function (error) {
    console.log('数据库连接失败:' + error);
});

db.connection.on('open', function () {
    console.log('数据库连接成功');
});

//创建user数据库模型
mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

var ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.model('Article', new mongoose.Schema({
    title: String,
    content: String,
    poster: String,
    user: {type: ObjectId, ref: 'User'} //对象id类型，引用user
}));


global.Model = function (modName) {
    return mongoose.model(modName);
};

