//生成验证码图片模块
var captchapng = require('captchapng');
module.exports = function(){//req,res
    var verificationcode = parseInt(Math.random()*9000+1000)
    var p = new captchapng(80,30,verificationcode); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    return {
        img:imgbase64,
        verificationcode:verificationcode.toString()
    }
}