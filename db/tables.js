module.exports = {
    User:{
        username:{type:String,required:true},//用户名
        password:{type:String,required:true},//密码
        email:{type:String,required:false},//邮箱
        avatar:{type:String,required:false},//头像
        age:{type:Number,required:false},//年龄
        job:{type:String,required:false},//职业
        hobby:{type:String,required:false}//爱好
    },
    Article:{
        username:{type:String,required:true},//用户名
        title:{type:String,required:false},//标题
        content:{type:String,required:false},//内容
        time:{type:String,required:false}//时间
    }
}