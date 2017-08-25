$(function(){
    var $page = $('#home_index'),
        pageStr = 'home_index',
        pageNum = 1,
        pageSize = 6,
        allCount = 0,
        loadComplate = true;

    // 获取位置
    $page.find('>div.header >a.location >span').text(
        $$.getLocationInfo().name
    );
    $page.find('>div.header').removeClass('on');

    // 懒加载
    $page.find('>div.main').scrollTop(0).scroll(function() {
        if ($(this).scrollTop() > $('#home_index_banner_top').height()) {
            $page.find('>div.header').addClass('on');
        } else {
            $page.find('>div.header').removeClass('on');
        }
        if (loadComplate) {
            if (pageNum * pageSize < allCount) {
                var proBox = $(this).find('>div.content >div.products'),
                    maxScroll = $(this).find('div.content').height() - $(this).height();
                if ($(this).scrollTop() == maxScroll) {
                    proBox.addClass('loading');
                    getProductsList(++pageNum, pageSize);
                    $(this).scrollTop($(this).scrollTop() - 10);
                    loadComplate = false;
                }
            }
        } else {
            return false;
        }
    });
    
    // 获取商品
    getProductsList(pageNum, pageSize);
    
    // 加载商品列表
    function getProductsList(pn, ps) {
        var $proBox = $page.find('>div.main >div.content >div.products');
        $$.get(
            'Product/Prod/QueryProdList?N=' + pn + '&Rows=' + ps + '&ProductType=-1',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取商品信息失败');
                    return false;
                }
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    if (pn == 1) {
                        $proBox.empty();
                        allCount = parseInt(res.Data.Count);
                    }
                    var d = res.Data.Rows;
                    $proBox.append(template(pageStr + '_products', {
                        list: d,
                        length: d.length,
                        serverAddr: $$.config.serverAddr
                    }));
                    $proBox.removeClass('loading');
                    if (pageNum * pageSize >= allCount) {
                        $proBox.addClass('loaded');
                    } else {
                        $proBox.removeClass('loaded');
                    }
                    loadComplate = true;
                }
            }
        );
    }

    $page.off('click', 'div.header a.scan').on('click', 'div.header a.scan', function() {
        if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
            wx.scanQRCode({
                needResult: 1,
                scanType: ["qrCode","barCode"],
                success: function (res) {
                    var result = res.resultStr;
                    if (!$$.getCookie('__TOKEN__')) {
                        var redirecturl = result.split('?R=')[1];
                        $$.authConfirm(function(){},
                            function(){
                                $$.redirect("home/wechatLogin.html?redirecturl=" + escape(redirecturl));
                            });
                    } else {
                        location.href = result;
                    }
                    return false;
                }
            });
        } else if (navigator.userAgent.indexOf('csl-ios') != -1) {
            wx.scanQRCode({
                needResult: 0
            });
        } else if (navigator.userAgent.indexOf('csl-android') != -1) {
            wx.scanQRCode({
                needResult: 0
            });
        }
    });
    //微信配置
    var WXsign = $$.getWeChatSign(1);
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: $$.config.wxAppID, // 必填，公众号的唯一标识
        timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
        nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
        signature: WXsign.sign, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    // 获取地理位置
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            geocoder2Address([+longitude + 0.006, latitude]);
        }
    });
    // layer
    function loactionConfirm(name, callback) {
        layer.open({
            area: '80%',
            shade: 0.3,
            title: false, //不显示标题栏
            closeBtn: false,
            btn: [],
            id: 'home_index_confirm',
            content: template('home_index_confirm_cnt', {
                dist: name
            }),
            success: function(modal) {
                modal.css({
                    'border-radius': '8px'
                });
                modal.find('.layui-layer-btn').remove();
                modal.find('button.cancel').off('click').on('click', function() {
                    layer.closeAll();
                });
                modal.find('button.change').off('click').on('click', function() {
                    if (callback) {
                        callback();
                    }
                    layer.closeAll();
                });
            }
        });
    }
    // 经纬度-->地址
    function geocoder2Address(geocodeArr) {
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(geocodeArr, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var info = result.regeocode.addressComponent,
                    ltInfo = $$.getLocationInfo();
                    //alert(ltInfo && ltInfo.id != info.adcode);
                if (ltInfo && ltInfo.id != info.adcode) {
                    loactionConfirm(info.district, function() {
                        $$.setLocationInfo({
                            name: info.district,
                            longitude: geocodeArr[0],
                            latitude: geocodeArr[1],
                            id: info.adcode
                        });
                        $page.find('>div.header >a.location >span').text(
                            info.district
                        );
                    });
                }
            }
        });
    }
});