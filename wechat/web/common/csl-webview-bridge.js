!(function($, window) {

    var js2ocHandlerName = 'cslJsBridgeHandler';
    var oc2jsHandlerName = 'cslRegisterJsBridgeHandler';





    // 申明交互 -->
    function setupWebViewJavascriptBridge(callback) {

        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        } else {
            //获取平台
            var palteform = getPlateform();
            if (palteform == 'iOS') {
                if (window.WVJBCallbacks) {
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'https://__bridge_loaded__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            } else {
                // androd
                document.addEventListener(
                    'WebViewJavascriptBridgeReady',
                    function() {
                        callback(WebViewJavascriptBridge)
                    },
                    false
                );
            }


        }


    }
    //处理交互  方法名要和移动端内定义的对应-->
    setupWebViewJavascriptBridge(function(bridge) {
        csl.bridge = bridge;
        var palteform = getPlateform();
        if (palteform != 'iOS') {
            // androd
            bridge.init(function(message, responseCallback) {});
        }

        // 处理 移动端 调用 js -->registerHandler
        bridge.registerHandler(oc2jsHandlerName, function(data, responseCallback) {

            if (data.messageType == 'pickImages') {
                var imagArr = data.imageVals;
                csl.handlerImages(imagArr);

                return;
            }
            if (data.messageType == 'jumpToUrl') {
                var url = data.url;
                csl.jumpToUrl(url);
                return;
            }

            //处理移动端给的传参
            if (csl.recieveMessageFromPhone) {
                csl.recieveMessageFromPhone(data, responseCallback);
            }

        });

    });

    function getPlateform() {
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("csl-ios") >= 0) {
            return 'iOS';
        } else if (userAgent.indexOf("csl-androd") >= 0) {
            return 'androd';
        }
        return '0';
    }
    // 对外暴露对象
    var csl = $.extend({}, {
        callbacks: {},
        defaultSet: {
            token: '',
            signature: '',
        },

        bridge: null,
        handlerName: js2ocHandlerName,
        recieveMessageFromPhone: null,
        readyFun:null,

        config: function(data) {
            $.extend(this.defaultSet, data);
            
        },
        ready: function(data) {
            this.readyFun = data;
            this.readyFun();
        },
        //检测接口是否能用
        checkJsApi: function(data, callback) {
            sendMessageToPhone('checkJsApi', data, callback);
        },
        //分享
        shareToPlatform: function(platform, data, callback) {
            $.extend(data, { platform: platform });
            sendMessageToPhone('onMenuShare', data, callback);

        },
        //调起分享界面
        onMenuShowShareView: function(data, callback) {
            this.shareToPlatform('shareAlert', data, callback);
        },
        //分享到朋友圈
        onMenuShareTimeline: function(data, callback) {
            this.shareToPlatform('wechatTimeLine', data, callback);
        },
        //分享到微信好友
        onMenuShareAppMessage: function(data, callback) {
            this.shareToPlatform('wechatFriend', data, callback);
        },
        //分享到qq
        onMenuShareQQ: function(data, callback) {
            this.shareToPlatform('qq', data, callback);

        },
        //分享到qq空间
        onMenuShareQZone: function(data, callback) {
            this.shareToPlatform('qqZone', data, callback);

        },
        //分享到微博
        onMenuShareWeibo: function(data, callback) {
            this.shareToPlatform('weibo', data, callback);

        },


        //选择照片或者拍照
        chooseImage: function(data, callback) {

            sendMessageToPhone('chooseImage', data, callback);
        },
        //上传图片接口
        uploadImage: function(data, callback) {
            sendMessageToPhone('uploadImage', data, callback);
        },
        //预览图片接口
        previewImage: function(data, callback) {
            sendMessageToPhone('previewImage', data, callback);
        },
        //获取本地图片接口
        getLocalImgData: function(data, callback) {
            sendMessageToPhone('getLocalImgData', data, callback);
        },
        //扫描二维码
        scanQRCode: function(data, callback) {

            sendMessageToPhone('scanQRCode', data, callback);
        },
        //获取网络状态
        getNetworkType: function(data, callback) {
            sendMessageToPhone('getNetworkType', data, callback);
        },
        //使用内置地图查看位置接口
        openLocation: function(data, callback) {
            sendMessageToPhone('openLocation', data, callback);
        },
        //获取地理位置接口
        getLocation: function(data, callback) {
            sendMessageToPhone('getLocation', data, callback);

        },
        //打电话-发邮件-发短信
        openTelSMSandEmail: function(data, callback) {
            sendMessageToPhone('openTelSMSandEmail', data, callback);
        },
        //获取通讯录
        getAddresBook: function(data, callback) {
            sendMessageToPhone('getAddresBook', data, callback);
        },
        //跳转登录页面
        showLoginPage: function(data, callback) {
            sendMessageToPhone('showLoginPage', data, callback);
        },
        //获取code刷新界面
        refreshPage: function(data, callback) {
            sendMessageToPhone('refreshPage', data, callback);
        },
        //发送自定义消息
        sendCustomMessage: function(data, callback) {
            sendMessageToPhone('sendCustomMessage', data, callback);
        },

        //跳转页面
        jumpToUrl: function(url) {
            location.href = url;
        },
        //处理图片信息
        handlerImages: function(imagArr) {
            $(imagArr).each(function(index, element) {
                var key = element.imageKey;
                var imag = element.imageVal;

                $("img[src='" + key + "']").attr('src', imag);
                // $("img[src='cslLocalResource://1']").attr('src',imag);
            });
        },
        testMethod: function() {
            alert('testMethod');
            alert(this.bridge);
        }

    });

    function sendMessageToPhone(methodName, data, callback) {
        var tempCallback = callback;
        
        data = data || {};

        var callbacks = {};
        if (data.success) {
            callbacks['success'] = data.success;
            tempCallback = data.success;
            delete data.success;
        }
        if (data.fail) {
            callbacks['fail'] = data.fail;
            delete data.fail;
        }
        if (data.complete) {
            callbacks['complete'] = data.complete;
            delete data.complete;
        }
        if (data.cancel) {
            callbacks['cancel'] = data.cancel;
            delete data.cancel;
        }
        if (data.trigger) {
            callbacks['trigger'] = data.trigger;
            delete data.trigger;
        }
        csl.callbacks[methodName] = callbacks;

        var params = {
            config: csl.defaultSet,
            method: methodName,
            data: data 
        };
        csl.bridge.callHandler(csl.handlerName, params, function(res) {
            var method = methodName;
            var status = res.status;
            var callbackData = res.data;

            var callbackMethods = csl.callbacks[method];
            if (callbackMethods.complete) {
                callbackMethods.complete(callbackData);
            }
            var callbackfun = callbackMethods[status];
            if (callbackfun) {
                callbackfun(callbackData);
            }

        });
    }

    window.wx = csl;
}($, window));
