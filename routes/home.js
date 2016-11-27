var express = require('express');
var router = express.Router();
//数据模型
var models = require('../db/models.js');
//权限中间件
var jurisdiction = require('./middleware/jurisdiction.js');
/* 主页 */
router.get('/',jurisdiction.isLogin, function(req, res, next) {
    var username =  req.session.username;
    //查询数据库，看用户名密码是否匹配
    var UserModel = models.getUserModel;
    //查询
    UserModel.find({username:username},{},function(error,dosc){
        if(error) return;
        console.log(dosc[0]);
        res.render('index', {'title':'峰峰博客','userObj':dosc[0]});
    });
});

/*
主页异步获取数据
*/
router.post('/getArticleList', function(req, res, next) {
    var username =  req.session.username;
    var page = req.query.page;
    var length = req.query.length;
    //console.log(page +"----"+ length );
    var ArticleModel = models.getArticleModel;
    ArticleModel.find({username:username},{},{limit:page*length},function(error,dosc){
        if(error){
            console.log(error);
            res.json({ status:0,username:username });
        }else{
            //console.log(dosc);
            res.json({ status:1,username:username,articles:dosc});
        }
    });
});

module.exports = router;
