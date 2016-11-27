var express = require('express');
var router = express.Router();
//数据模型
var models = require('../db/models.js');
//权限中间件
var jurisdiction = require('./middleware/jurisdiction.js');
/*
*发表文章页面
*/
router.get('/add', jurisdiction.isLogin ,function(req, res, next) {
  res.render('articles/add', { title: 'Express' });
});

/*
*添加文章
*/
router.post('/add',jurisdiction.isLogin, function (req, res) {
    var body = req.body;
    if(body.title !== ""&& body.content !==""){//有内容，保存到数据库
        var ArticleModel = models.getArticleModel;
        ArticleModel.create([
            {username:req.session.username,title:body.title,content:body.content,time:(new Date)*1}
        ],function(error,docs){
            if (error){
                return res.redirect('/articles/add');
            }
            res.redirect('/');
        });
    }else{
        res.redirect('/articles/add');
    }
});

module.exports = router;