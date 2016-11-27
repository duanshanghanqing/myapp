//备注：使用"require-directory"插件获取依赖的键值对，并注册到app中。
var requireDirectory = require('require-directory') ;
var routes = requireDirectory(module, __dirname) ;
module.exports = function (app) {
    Object.keys(routes).forEach(function (key) {
        if(key === 'index') return;
        if (key === 'home') {
            app.use('/', routes[key]);
        }else if(key !== 'middleware' && key !== 'tool'){
            app.use('/'+ key, routes[key]);
        }
    });
};