$(function(){
    var $page = $('#home_index'),
        pageStr = 'home_index',
        pageNum = 1,
        pageSize = 9,
        allCount = 0,
        loadComplate = true;

    // 获取位置
    $page.find('>div.header >a.location >span').text(
        $$.getLocationInfo().name
    );

    // 懒加载
    $page.find('>div.main').scrollTop(0).scroll(function() {
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
    
    // banner
    getBanners(function() {
        TouchSlide({
            slideCell: "#home_index_banner",
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
    getProductsList(pageNum, pageSize);
    
    // 获取banner相关
    function getBanners(calback) {
        var $banner = $('#home_index_banner >div.bd >ul');
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
    // 加载商品列表
    function getProductsList(pn, ps) {
        var $proBox = $page.find('>div.main >div.content >div.products');
        $$.get(
            'Product/Prod/QueryList?N=' + pn + '&Rows=' + ps,
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
});