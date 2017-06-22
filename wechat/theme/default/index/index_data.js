$(function(){
    var $page = $('#index_index'),
        pageStr = 'index_index';

    // 获取位置
    $page.find('>div.header >a.location >span').text(
        $$.getLocationInfo().name
    );

    // banner
    getBanners(function() {
        TouchSlide({
            slideCell: "#index_index_banner",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "left",
            autoPlay: true, //自动播放
            autoPage: true, //自动分页
            switchLoad: "_src", //切换加载，真实图片路径为"_src" 
            interTime: 3000 // 切换间隔时间，毫秒
        });
    });
    // 获取商品
    getProductsList();
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
    // 经纬度-->地址
    function geocoder2Address(geocodeArr) {
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(geocodeArr, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                var info = result.regeocode.addressComponent;
                $$.setLocationInfo({
                    name: info.district,
                    longitude: geocodeArr[0],
                    latitude: geocodeArr[1],
                    id: info.adcode
                });
                $page.find('>div.header >a.location >span').text(
                    info.district
                );
            }
        });
    }
    // 获取banner相关
    function getBanners(calback) {
        var $banner = $('#index_index_banner >div.bd >ul');
        $$.get(
            'Product/Banner/QueryBannerList?BannerID=1',
            function(res) {
                if (res.Status == 0 && res.Data && res.Data.Rows) {
                    $banner.html(template(pageStr + '_banner_list', {
                        list: res.Data.Rows,
                        serverAddr: $$.config.serverAddr
                    }));
                    if (calback) {
                        calback();
                    }
                }
            }
        );
    }
    // 加载商品列表
    function getProductsList() {
        var $proBox = $page.find('>div.main >div.content >div.products').empty();
        $$.get(
            'Product/Prod/QueryList',
            function(res) {
                if (res.Status != 0) {
                    console.log('获取商品信息失败');
                    return false;
                }
                if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
                    var d = res.Data.Rows;
                    $proBox.html(template(pageStr + '_products', {
                        list: d,
                        length: d.length,
                        serverAddr: $$.config.serverAddr
                    }));
                }
            }
        );
    }
});