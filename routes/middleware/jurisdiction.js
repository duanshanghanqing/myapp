//登陆注册使用
exports.LoginReg = function(req, res, next) {
    res.locals.username = null;
    next();
}
//是否登陆
exports.isLogin = function(req, res, next) {
    if(req.session.username){//以登陆
        res.locals.username = req.session.username;
        next();
    }else{//未登陆
        res.locals.username = null;
        return res.redirect('/users/login');
    }
}
