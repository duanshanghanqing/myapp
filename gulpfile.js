var gulp = require('gulp');

//编译less文件
var less = require('gulp-less');
//压缩css
var minifycss = require('gulp-minify-css');

//编译es6
var babel = require('gulp-babel');
//js检测
var jshint = require('gulp-jshint');
//js压缩
var uglify = require('gulp-uglify');
//js重命名
var rename = require('gulp-rename');
//清空编译后的文件夹
var clean = require('gulp-clean');

//编译less文件
gulp.task('less', function () {
    //拷贝编译后，压缩后的文件到生产环境
    gulp.src('./public/less/**/*.less')
        .pipe(less())//编译css
        .pipe(minifycss())//压缩
		.pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/css/'));
});

//编译js
gulp.task('js', function() {
    return gulp.src(['./public/jssrc/**/*.js'])//原文件
		.pipe(babel({//编译es6
				presets: ['es2015']
		}))
        .pipe(jshint())//js语法检测
		.pipe(uglify({outSourceMap: false}))//js压缩
		.pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/js/'));//把合并后的文件，拷贝到生成环境中
});

//清空
gulp.task('clean', function () {
    return gulp.src(['./public/css/','./public/js/'])//要删除的文件
        .pipe(clean({force: true}))
});

//编译
gulp.task('build',['less','js'], function() {
    console.log('编译完毕');
});


//实现源文件发生改变，目标文件内的文件也同步发生变化
gulp.task('watch',function(){
    gulp.watch('./public/less/**/*.less',['less']);
    gulp.watch('./public/jssrc/**/*.js',['js']);
});

gulp.task('default',['watch'], function() {
    console.log('多个任务执行完毕');
});