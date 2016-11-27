function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

const ip = getIPAdress();
const port = 3000;
console.log(ip);
module.exports = {
    cookieSecret:'myapp',
    host:ip, 
    port:port,  
    url:"mongodb://"+ip+":27017/blog",
    staticResources:"http://"+ip+":"+port
}