$(function() {
    var $page = $('#icenter_info'),
    	pageStr = 'icenter_info',
        token = $$.getToken();
	
    initUInfo();

    
    //微信配置
    var WXsign = $$.getWeChatSign(1);
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx2c53034422e377cc', // 必填，公众号的唯一标识
        timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
        nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
        signature: WXsign.sign, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    $page.off('click', 'div.mask').on('click', 'div.mask', function() {
        maskFadeOut();
    }).off('click', 'div.button-group').on('click', 'div.button-group', function(e) {
        var option = $(e.target);
        if (option.attr('data-type') == 'sex') {
            $page.find('div.sex span').text(option.text());
        } else if (option.attr('data-type') == 'icon') {
            if (option.attr('data-id') == 0) {
                alert('相册');
            } else if (option.attr('data-id') == 1) {
                alert('拍照');
                wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    sourceType: ['camera'],
                    success: function(res) {
                        var localIds = res.localIds;
                        alert(localIds);
                    }
                });
            }
        }
        maskFadeOut();
        e.stopPropagation();
        e.preventDefault();
    });

    function maskFadeOut(item) {
        $page.find('div.mask').fadeOut(200).find('>div').animate({
            'height': '0'
        }, 200);
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