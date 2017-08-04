$(function() {
    var $page = $('#home_location'),
    	pageStr = 'home_location';
	
    // 获取位置
    $page.find('>div.main >div.there >p').text('定位中 · · ·').removeClass('complete');

	// 重置城市列表
	resetCityList();
    
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

    // 重置城市列表
    function resetCityList() {
        $page.find('>div.header >div >i').hide();
        $page.find('>div.header input.search').val('');
        $page.find('>div.main >div.there').show();
        $page.find('div.cities >h5').show();
        $page.find('div.cities >ul.cityLtr').show();
        $page.find('div.cities >div.city').show().removeClass('active');
        $page.find('div.dist >span').css({
            'display': 'inline-block'
        });
    }
    // 经纬度-->地址
    function geocoder2Address(geocodeArr) {
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(geocodeArr, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var info = result.regeocode.addressComponent;
                $page.find('>div.main >div.there >p')
                     .text(info.district)
                     .attr('data-name', info.district)
                     .attr('data-lng', geocodeArr[0])
                     .attr('data-lat', geocodeArr[1])
                     .attr('data-id', info.adcode)
                     .addClass('complete');
            }
        });
    }
});