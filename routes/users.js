var express = require('express');
var router = express.Router();

//数据模型
var models = require('../db/models.js');
//工具类
var tool = require('./tool/tool.js');
//生成验证码
var verification = require('./tool/verification.js');
//权限中间件
var jurisdiction = require('./middleware/jurisdiction.js');

//使用文件上传模块
var multipartMiddleware = require('connect-multiparty')();
var fs = require('fs');


/**
 * 用户注册
 */
router.get('/reg', jurisdiction.LoginReg, function (req, res) {
    res.render('user/reg', { title: '注册' });
});


/**
 * 当填写用户注册信息提交时的处理
 */
router.post('/reg', function (req, res) {
    var body = req.body;
    if (body.password === body.repassword) {//两次密码相同，注册成功，把信息写入数据库，重定向到主页
        var UserModel = models.getUserModel;
        UserModel.create([
            { username: body.username, password: tool.encryption(body.password), email: body.email, avatar: body.avatar }
        ], function (error, docs) {
            if (error) {//写入数据失败
                console.log("插入数据失败：" + error);
                res.redirect('/users/reg');//重定向到当前注册页面
            } else {//写入数据成功，重定向到首页，把用户名写入到session
                req.session.username = body.username;//把用户名保存到session中
                res.redirect('/');//重定向到首页
            }
        });
    } else {//注册失败，重新注册
        res.render('user/reg', { title: '注册' });
    }
});


/**
 * ajax文件上传
 */
router.post('/upload', multipartMiddleware, function (req, res) {
    //console.log(req.body);
    var fileName = req.files.myfile.originalFilename;//文件名
    var prefix = fileName.substr(0, fileName.lastIndexOf("."));//前缀
    var suffix = fileName.substr(fileName.lastIndexOf("."));//后缀
    var encryptionFileName = tool.encryption(prefix + new Date() * 1) + suffix;//加密后的文件名
    //console.log( encryptionFileName );

    //把上传的文件存放到指定的目录中
    var file = fs.createReadStream(req.files.myfile.path);//把当前上传的文件从临时目录读取出来，输出流
    file.pipe(fs.createWriteStream('./public/file/' + encryptionFileName));//写入到指定的目录，输入流

    //在删除临时文件
    fs.unlink(req.files.myfile.path);
    res.json({ 'fileUrl': encryptionFileName });//向客户端返回上传文件保存的地址
});


/* 
*登陆页面
*/
router.get('/login', jurisdiction.LoginReg, function (req, res, next) {
    res.render('user/login');
});


/* 
*登陆页面提交表单
*/
router.post('/login', function (req, res, next) {
    var body = req.body;
    console.log("客户端发送验证码：" + body.verificationcode + "------------------------------session读取验证码：" + req.session.verificationcode);
    if (body !== null && body.username !== "" && body.password !== "" && body.verificationcode == req.session.verificationcode) {//数据提交完整
        //查询数据库，看用户名密码是否匹配
        var UserModel = models.getUserModel;
        //查询
        UserModel.find({ username: body.username, password: tool.encryption(body.password) }, {}, function (error, dosc) {
            if (error) {//查询失败
                console.log(error);
                return;
            } else {//查询成功
                if (dosc.length === 0) {//没有查询到，到登录页面
                    console.log(dosc);
                    res.redirect('/users/login');
                } else {//查询到，到首页，把用户名保存到
                    console.log(dosc);
                    req.session.username = body.username;
                    res.redirect('/');
                }
            }
        });
    } else {//数据提交不完整。重新登录
        res.redirect('/users/login');
    }
});


/**
 * 生成验证码
 */
router.get('/verificationcode', function (req, res) {
    //把验证码保存在session内
    var verificationObj = verification();
    req.session.verificationcode = verificationObj.verificationcode;
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(verificationObj.img);
});


/**
 * 个人信息页面
 */
router.get('/details', jurisdiction.isLogin, function (req, res) {
    var username = req.session.username;
    var UserModel = models.getUserModel;
    UserModel.find({ username: username }, {}, function (error, dosc) {
        if (error) return;
        res.render('user/details', { 'title': '个人信息', 'userObj': dosc[0] });
    });
});

/**
 * 提交个人信息
 */
router.post('/submitDetails', jurisdiction.isLogin, function (req, res) {
    var username = req.session.username;
    //客户端提交数据
    var client_username = req.body.username;
    var client_email = req.body.email;
    var client_age = req.body.age;
    var client_job = req.body.job;
    var client_hobby = req.body.hobby;
    var UserModel = models.getUserModel;
    UserModel.update({username: username}, {
        $set: {username:client_username , email:client_email , age:client_age , job:client_job , hobby:client_hobby}
    }, function(err) {
        if(err) return;
        req.session.username = client_username;
        res.redirect('/');
    });
});


/**
 * 退出登陆
 */
router.get('/logout', function (req, res) {
    req.session.username = null;//用户信息存入 session
    req.session.verificationcode = null;
    res.redirect('/');//注册成功后返回主页
});

module.exports = router;
