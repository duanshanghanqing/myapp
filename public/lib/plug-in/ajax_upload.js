(function(){
    //使用ajax文件上传
    function ajax_upload(obj){

        var url="";
        if(obj.url !== "" && obj.url !==null && obj.url !==undefined){
            url = obj.url;
        }

        var files;
        if(obj.files !== "" && obj.files !==null && obj.files!==undefined && obj.files.length>0){
            files = obj.files;
        }else{
            return;
        }

        var i = 0;
        var xhr;
        function fileUpload(index){
            // 1.准备FormData
            var fd = new FormData();
            fd.append("myfile", obj.files[index]);

            // 2.创建xhr对象
            xhr = new XMLHttpRequest();

            // 监听状态，实时响应
            // xhr 和 xhr.upload 都有progress事件，xhr.progress是下载进度，xhr.upload.progress是上传进度
            //这里监听上传进度事件，文件在上次的过程中，会多次触发该事件，返回一个event事件对象
            xhr.upload.onprogress = function(event) {
                obj.uploadedBeing && obj.uploadedBeing(event);
            };

            // 传输开始事件
            xhr.onloadstart = function(event) {
                obj.uploaduStart && obj.uploaduStart(event);
            };
            // xhr.abort();//调用该方法停止ajax上传，停止当前的网络请求

            //每个文件上传成功
            xhr.onload = function(event) {
                obj.uploadSuccess && obj.uploadSuccess(event);
                obj.serviceCallback && obj.serviceCallback(xhr.responseText);
                setTimeout(function(){
                    index++
                    console.log(index);
                    if(index<files.length){
                        fileUpload(index);
                    }
                },1000);
            };

            // ajax过程发生错误事件
            xhr.onerror = function(event) {
                obj.uploadError && obj.uploadError(event);
            };

            // ajax被取消，文件上传被取消，说明调用了 xhr.abort();  方法，所触发的事件
            xhr.onabort = function(event) {
                obj.uploadCancelled && obj.uploadCancelled(event);
            };

            // loadend传输结束，不管成功失败都会被触发
            xhr.onloadend = function (event) {
                obj.uploadEnd && obj.uploadEnd(event);
            };

            // 发起ajax请求传送数据
            xhr.open('POST',url , true);
            xhr.send(fd);//发送文件
        }
        fileUpload(i);

        return {
            abort:function(){//ajax被取消，文件上传被取消
                xhr.abort();//调用该方法停止ajax上传，停止当前的网络请求
            }
        };

    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function iframe_upload(obj){
        function createDom(){
            var isCreateElement = true;
            try {
                document.createElement();
            } catch(e){
                isCreateElement = false;
            }

            if(isCreateElement){
                console.log("支持");
            }else{

            }
        }
        createDom();




        var url="";
        if(obj.url !== "" && obj.url !==null && obj.url !==undefined){
            url = obj.url;
        }

        var files;
        if(obj.files !== "" && obj.files !==null && obj.files!==undefined && obj.files.length>0){
            files = obj.files;
        }else{
            return;
        }

        return {
            abort:function(){//ajax被取消，文件上传被取消

            }
        };
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    window.multiFileUpload = function (obj){
        var isFormData = true;
        try {
            new FormData();
        }catch(e){
            isFormData = false;
        }

        if(isFormData){
            return ajax_upload(obj);
        }else{
            return iframe_upload(obj);
        }
    }
})();