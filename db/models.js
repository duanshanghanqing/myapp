var db       = require('./db');
var tables   = require('./tables');
var mongoose = require("mongoose");

/*创建User数据模型*************************************************************/
var UserModel = db.model("user",new mongoose.Schema(tables.User,{
    collection:'user'//定义数据库(文档)表的名字
}));
//添加初始化数据
/*
UserModel.create([
    {username:"zhangshan",password:"123456789",email:"490771426@qq.com",avatar:"http://musicdata.baidu.com/data2/pic/242503794/242503794.jpg"}
],function(error,docs){
    if (error){
        console.log("插入数据失败："+error);
    }
    console.log(docs);
});
*/
/*创建Article数据模型**********************************************************/
var ArticleModel = db.model("article",new mongoose.Schema(tables.Article,{
    collection:'article'//定义数据库(文档)表的名字
}));
/******************************************************************************/
module.exports = {
    "getUserModel"   :UserModel,
    "getArticleModel":ArticleModel
};