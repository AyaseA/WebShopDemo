$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#index_index').height(bodyHeight),
        pageStr = 'index_index',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();

    // 设置主窗口高度和位置
    resetWindowSize();
    // 窗口尺寸变化重新计算窗口高度和位置
    window.onresize = function() {
        bodyHeight = window.innerHeight || document.body.clientHeight;
        headerHeight = $page.find('>div.header').height();
        footerHeight = $page.find('>div.footer').height();
        resetWindowSize();
    };
    // 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
    $page.on('click', 'div.entrance >div', function() {
        var type = $(this).attr('data-type');
        switch(type) {
            case 'carWash': {
                // 一元洗车
                $$.redirect('cleaningCar/cleaningCar.html');
            } break;
            case 'maintain': {
                // 车辆信息
                $$.redirect('myCars/myCars.html');
            } break;
            case 'friendAdd': {
                // 邀请有礼
                $$.redirect('invite/invite.html');
            } break;
        }
    });
    // 活动点击事件
    $page.on('click', 'div.activity', function() {
        $$.redirect('activity/activity.html', 0);
    });
    // 点击商品查看详情
    $page.on('click', 'div.products img', function() {
        var pid = $(this).parent().attr('data-id');
        $$.redirect('product/product.html?pid=' + pid);
    });
    // footer 事件
    $page.on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch(type) {
            case 'index': {
                // 首页
                //$$.redirect('index/index.html');
            } break;
            case 'carCrv': {
                // 服务网点
                $$.redirect('shopList/shopList.html');
            } break;
            case 'activity': {
                // 活动
                $$.redirect('luckyDraw/luckyDraw.html');
            } break;
            case 'center': {
                // 个人中心
                $$.redirect('pageHome/pageHome.html');
            } break;
        }
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
    // 重设窗口高度
    function resetWindowSize() {
        $page.find('>div.main').css({
            'height': bodyHeight - headerHeight - footerHeight - 1
        });
    }
    // layer
    function loactionConfirm(name, callback) {
        layer.open({
            area: '80%',
            shade: 0.3,
            title: false, //不显示标题栏
            closeBtn: false,
            btn: [],
            id: 'index_index_confirm',
            content: template('index_index_confirm_cnt', {
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