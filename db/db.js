
//全局配置
var settings = require("../settings");
//1. 连接数据库
var mongoose = require("mongoose");
// 连接字符串格式为mongodb://主机/数据库名
var db = mongoose.connect(settings.url);//mongodb://localhost/mydb

db.connection.on("error",function(error){
    console.log("连接数据库失败"+error);
});

db.connection.on("open",function(){
    console.log("连接数据库成功");
});
module.exports = db;