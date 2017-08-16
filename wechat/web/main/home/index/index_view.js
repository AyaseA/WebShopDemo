$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_index').height(bodyHeight),
        pageStr = 'home_index',
        footerHeight = $page.find('>div.footer').height();

    if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.header').height(56).find('>a').css({
            'bottom': 1
        });
    }
 
    // 设置主窗口高度和位置
    resetWindowSize();
    
    // 窗口尺寸变化重新计算窗口高度和位置
    window.onresize = function() {
        bodyHeight = window.innerHeight || document.body.clientHeight;
        footerHeight = $page.find('>div.footer').height();
        resetWindowSize();
    };

    TouchSlide({
        slideCell: "#home_index_banner_middle",
        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
        mainCell: ".bd ul",
        effect: "left",
        autoPlay: true, //自动播放
        autoPage: true, //自动分页
        switchLoad: "_src", //切换加载，真实图片路径为"_src" 
        interTime: 3000 // 切换间隔时间，毫秒
    });
    // banner
    getBanners(function() {
        TouchSlide({
            slideCell: "#home_index_banner_top",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "left",
            autoPlay: true, //自动播放
            autoPage: true, //自动分页
            switchLoad: "_src", //切换加载，真实图片路径为"_src" 
            interTime: 3000 // 切换间隔时间，毫秒
        });
    });
    // 获取banner相关
    function getBanners(calback) {
        var $banner = $('#home_index_banner_top >div.bd >ul');
        $.ajax({
            url: $$.serverAddr + 'Product/Banner/QueryBannerList',
            type: 'POST',
            data: {
                BannerTypeID: 1
            },
            dataType: 'json',
            success: function(res) {
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
        });
    }

    // 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
    $page.on('click', 'div.entrance >div', function() {
        var type = $(this).attr('data-type');
        switch(type) {
            case 'package': {
                $$.redirect('home/package.html');
            } break;
            case 'service': {
                $$.redirect('home/service.html');
            } break;
            case 'maintain': {
                $$.redirect('home/myCars.html');
            } break;
        }
    });
    
    // news
    $page.on('click', 'div.news >img', function() {
        $$.redirect('home/product.html?pid=7');
    });

    // recomened
    $page.on('click', 'div.recommend >div[data-type="qrcodeMoveCar"]', function() {
        layer.msg('<!--  -->');
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
            'height': bodyHeight - footerHeight
        });
    }
});