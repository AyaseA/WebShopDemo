$(function() {
    var $page = $('#location_location'),
    	pageStr = 'location_location';
	
    // 获取位置
    $page.find('>div.main >div.there >p').text('定位中 · · ·').removeClass('complete');

	// 重置城市列表
	resetCityList();

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