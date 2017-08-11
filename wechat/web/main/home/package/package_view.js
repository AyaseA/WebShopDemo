$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_package').height(bodyHeight),
        pageStr = 'home_package';

    if (navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.header').height(56).find('>a').css({
            'bottom': 1
        });
    }

    // 窗口尺寸变化重新计算窗口高度和位置
    window.onresize = function() {
        bodyHeight = window.innerHeight || document.body.clientHeight;
        resetWindowSize();
    };

    // 设置返回页面
    $$.setGoBack($page.find('>div.header >a.goback'));

    // banner
    getBanners(function() {
        TouchSlide({
            slideCell: "#home_package_banner_top",
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
        var $banner = $('#home_package_banner_top >div.bd >ul');
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
                    // 设置主窗口高度和位置
                    resetWindowSize();
                }
            }
        });
    }

    // 点击商品查看详情
    $page.on('click', 'div.products div.item', function() {
        var pid = $(this).attr('data-id');
        $$.redirect('home/prodmulti.html?pid=' + pid);
    });

    // 立即购买
    $page.on('click', 'div.products div.item >a', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var url = $(this).attr('href');
        $$.redirect(url);
    });

    // 重设窗口高度
    function resetWindowSize() {
        var bannerHeight = $page.find('#home_package_banner_top').height();
        var titleHeight = $page.find('div.main div.title').height();
        $page.find('div.warp').height( bodyHeight - bannerHeight);
    }
});