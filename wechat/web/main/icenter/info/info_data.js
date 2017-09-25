$(function() {
    var $page = $('#icenter_info'),
    	pageStr = 'icenter_info',
        token = $$.getToken();
	
    initUInfo();

    var userInfo;
    $$.post("CSL/User/GetInfoByToken", {}, function(txt) {
        userInfo = JSON.parse(Base64.decode(unescape(txt.Data.Info)));
    }, function() {}, 1);
    
    $page.find(".name span").html(userInfo.RealName);

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

    $page.off('click', 'div.mask').on('click', 'div.mask', function() {
        maskFadeOut();
    }).off('click', 'div.btn-group').on('click', 'div.btn-group', function(e) {
        var option = $(e.target);
        if (option.attr('data-type') == 'sex') {
            $page.find('div.sex span').text(option.text());
        } else if (option.attr('data-type') == 'icon') {
            if (option.attr('data-id') == 0) {
                upLoadImg('album');
            } else if (option.attr('data-id') == 1) {
                upLoadImg('camera');
            }
        }
        maskFadeOut();
        e.stopPropagation();
        e.preventDefault();
    });

    $page.off('click', 'div.header-icon').on('click', 'div.header-icon', function() {
        if (navigator.userAgent.indexOf('csl-ios') != -1 || navigator.userAgent.indexOf('csl-android') != -1) {
            upLoadImg("camera");
        } else{
            $page.find('div.mask').fadeIn(200).find('>div').animate({
            'height': 160
            }, 200);
            $page.find('a.option1').text('拍照').attr('data-id', '1').attr('data-type', 'icon');
            $page.find('a.option2').text('相册').attr('data-id', '0').attr('data-type', 'icon');
        }
    });

    function maskFadeOut(item) {
        $page.find('div.mask').fadeOut(200).find('>div').animate({
            'height': '0'
        }, 200);
    }

    function upLoadImg(type) {
        var sourceType = [],
            from = 0;
        if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
            from = 1;
        } else if (navigator.userAgent.indexOf('csl-ios') != -1) {
            from = 2;
        } else if (navigator.userAgent.indexOf('csl-android') != -1) {
            from = 3;
        }
        if (type == 'camera') {
            sourceType.push('camera');
        } else {
            sourceType.push('album');
        }
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: sourceType,
            success: function (res) {
                var localIds = res.localIds;
                wx.uploadImage({
                    localId: localIds[0],
                    isShowProgressTips: 1,
                    success: function (res) {
                        var serverId = res.serverId;
                        $$.post(
                            'CSL/User/UpdateImg',
                            {
                                Img: serverId,
                                From: from
                            },
                            function(res) {
                                if (res.Status == 0) {
                                    $$.setUserInfo('Img', res.Data);
                                    initUInfo();
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    function initUInfo() {
        var img = $$.getUserInfo().Img,
            mobile = $$.getUserMobile();
        if (img) {
            img = $$.config.serverAddr + 'Img/' + $$.imgFilter(img);
        } else {
            img = './images/icon.png';
        }
        $page.find('div.account span').text(mobile);
        $page.find('div.header-icon img').attr('src', img);
    }
});