/**
 * 注册
 */
function Reg() {
    this.previewPictures();
}
/**
 * 选择图片并预览，并上传
 */
Reg.prototype.previewPictures = function(){
    var _ = this;
    var format = ["bmp","jpg","tiff","gif","pcx","tga","exif","fpx","svg","psd","cdr","pcd","dxf","ufo","eps","ai","raw","png"];
    $("#ImgFile").on("change",function(){
        var imgFiles = [];
        $.each(this.files,function(i,k){
            var suffix = _.getFileSuffix(k.name);
            if( format.indexOf( suffix ) != -1){//说明是图片
                imgFiles.push(k);
            }
        });
        if(imgFiles && imgFiles.length>0){
            console.log(imgFiles);
            _.ajax_upload(imgFiles);
        }else{
            console.log("请选择图片格式");
        }
    });
}
/**
 * 获取文件后缀名
 */
Reg.prototype.getFileSuffix = function(fileName){
    return fileName.substring(fileName.lastIndexOf('.') + 1);
}
/**
 * ajax上传文件
 */
Reg.prototype.ajax_upload = function(files){
    var _ = this;
    var res = multiFileUpload({
        url:"/users/upload",//上传地址
        files:files,//上传的文件
        uploaduStart:function(event){//开始上传
            console.log('开始上传');
        },
        uploadedBeing:function(event){//上传进度事件，文件在上次的过程中，会多次触发该事件，返回一个event事件对象
            if (event.lengthComputable) {//返回一个  长度可计算的属性，文件特别小时，监听不到，返回false
                //四舍五入
                var percent = Math.round(event.loaded * 100 / event.total);//event.loaded:表示当前已经传输完成的字节数。
                //event.total:当前要传输的一个总的大小.通过传输完成的除以总的，就得到一个传输比率
                console.log('进度', percent);
            }
        },
        uploadSuccess:function(event){//上传成功
            console.log('上传成功');
            //console.log(xhr.responseText);//得到服务器返回的数据
        },
        uploadError:function(event){//上传出错
            console.log('发生错误');
        },
        uploadCancelled:function(event){//取消上传
            console.log('操作被取消');
        },
        uploadEnd:function(event){//上传结束
            console.log('传输结束，不管成功失败都会被触发');
        },
        serviceCallback:function(data){//服务器回掉返回的数据
            console.log(data);
            _.checkFileChange(JSON.parse(data).fileUrl);
        }
    });

    /*var ajax_stop = document.getElementById("ajax_stop");
    ajax_stop.onclick=function(){
        res.abort();
    }*/
}

/**
 * 图片预览
 */
Reg.prototype.checkFileChange = function(url) {
    $("#showBox").css("display","block");
    $("#previewPicturesImg").attr("src","/file/"+url);
    $("#avatar").val(url);
}
$(function(){
    new  Reg();
});