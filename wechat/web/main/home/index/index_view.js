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

    // 懒加载
    var pageNum = 1,
        pageSize = 6,
        allCount = 0,
        loadComplate = true
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
            'Product/Prod/QueryProdList?N=' + pn + '&Rows=' + ps + '&ProductType=-1&Enable=1',
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

    // 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
    $page.on('click dbclick', 'div.entrance >div', function() {
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
    $page.on('click dbclick', 'div.news >img', function() {
        $$.redirect('home/prodservice.html?pid=51');
    });

    // recomened
    $page.on('click dbclick', 'div.recommend >div[data-type="qrcodeMoveCar"]', function() {
        $$.redirect('home/product.html?pid=48');
    });

    // 点击商品查看详情
    $page.on('click dbclick', 'div.products img, div.products p', function() {
        var pid = $(this).parent().attr('data-id'),
            type = $(this).parent().attr('data-type');
        if (type == 0) {
            type = 'product';
        } else if (type == 1) {
            type = 'prodservice';
        } else if (type == 5) {
            type = 'prodmulti';
        }
        $$.redirect('home/' + type + '.html?pid=' + pid);
    });
    
    // footer 事件
    $page.on('click dbclick', 'div.footer li', function() {
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
                location.href=$$.config.hostAddr+'Utilities/qr_ad/removeCar.html';
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