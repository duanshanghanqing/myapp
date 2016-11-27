/**
 *工具类
 */
//(加密)cipher
var crypto=require("crypto");//加载模块
var tool = {
    //加密
    encryption:function(str){
        var cipher = crypto.createCipheriv("bf","123456","12345678");
        var ER="";//定义一个加密结果(ER)
        ER +=cipher.update(str,"utf8","hex");
        ER +=cipher.final("hex");
        return ER;
    },
    //解密
    decrypt:function(str){
        var Decrypt=crypto.createDecipheriv("bf","123456","12345678");
        var DR="";//定义一个解密结果
        DR +=Decrypt.update(str,"hex","utf8");
        DR +=Decrypt.final("utf8");
        return DR;
    }
};
//test
/*
var jm = tool.encryption("abc");
console.log(jm);
var xm = tool.decrypt(jm);
console.log(xm);
*/
module.exports = tool;