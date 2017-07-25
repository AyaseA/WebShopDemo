$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_index').height(bodyHeight),
        pageStr = 'home_index',
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
                // 一元洗车活动
                $$.redirect('home/product.html?pid=7');
            } break;
            case 'maintain': {
                // 车辆信息
                $$.redirect('home/myCars.html');
            } break;
            case 'friendAdd': {
                // 邀请有礼
                $$.redirect('home/recommend.html');
            } break;
        }
    });
    // 活动点击事件
    $page.on('click', 'div.activity', function() {
        $$.redirect('home/activity.html');
    });
    // 点击商品查看详情
    $page.on('click', 'div.products img, div.products p', function() {
        var pid = $(this).parent().attr('data-id');
        $$.redirect('home/product.html?pid=' + pid);
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
                $$.redirect('shop/shopList.html');
            } break;
            case 'activity': {
                // 活动
                $$.redirect('home/product.html?pid=7');
            } break;
            case 'center': {
                // 个人中心
                $$.redirect('icenter/pageHome.html');
            } break;
        }
    });
    // 重设窗口高度
    function resetWindowSize() {
        $page.find('>div.main').css({
            'height': bodyHeight - headerHeight - footerHeight - 1
        });
    }
});