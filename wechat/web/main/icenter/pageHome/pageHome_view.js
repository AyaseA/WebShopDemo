!(function(){
	var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_pageHome'),
        pageStr = 'icenter_pageHome';

    $page.find('>div.main').height(
        bodyHeight * 0.99 - $page.find('>div.footer').height() - $page.find('>header').height() - 1
    );

    //个人信息
    $('.user_name').on('click', function() {
        $$.redirect('icenter/information.html');
    });    
    //邀请有礼
    $('#head_active_1').on('click', function() {
        $$.redirect('home/recommend.html');
    });
    //加油卡
    $('#head_active_2').on('click', function() {
        $$.redirect('icenter/gas.html');
    });
    //我的车辆
    $('#head_active_3').on('click', function() {
        $$.redirect('home/myCars.html');
    });
    //积分
    $('#reward').on('click', function() {
        layer.msg('即将开放，敬请期待~');
        return false;
        $$.redirect('icenter/reward.html');
    });
    //vip
    $('.header_vip').on('click', function() {
        $$.redirect('icenter/vip.html');
    });
    //我的收藏
    $('#my_cover').off('click').on('click', function() {
        $$.redirect("icenter/storefront.html?type=product");
    });
    $('#home_pageHome_store').off('click').on('click', function() {
        $$.redirect("icenter/storefront.html?type=store");
    });
    //商品列表
    $('#article_con_tent').on('click', function() {
        $$.redirect('icenter/orderList.html?type=all');
    });   
    //设置
    $('#login_set_out').on('click', function() {
        $$.redirect('icenter/logout.html');
    });
    //优惠券
    $('#content_account_wrap').on('click', function() {
        $$.redirect('icenter/discount.html');
    });
    //我的钱包
    $('#wallet').on('click', function() {
        $$.redirect('icenter/myWallet.html');
    });    
    //我的足迹
    $('#footprint').on('click', function() {
        $$.redirect('icenter/footprint.html');
    });     
    //势力币
    $('#bin').on('click', function() {
        $$.redirect('icenter/bin.html');
    });
    //意见反馈
    $('#advice').on('click', function() {
        $$.redirect('icenter/advice.html');
    });  
    //退换/售后
    $('#order_img_span_5').on('click', function() {
        $$.redirect('icenter/afterService.html');
    });     
    //跳转订单
    $('#order_img_span_1').off('click').on('click', function() {
        $$.redirect('icenter/orderList.html?type=waitPay');
    });
    $('#order_img_span_2').off('click').on('click', function() {
        $$.redirect('icenter/orderList.html?type=waitPost');
    });
    $('#order_img_span_3').off('click').on('click', function() {
        $$.redirect('icenter/orderList.html?type=waitGet');
    });
    $('#order_img_span_4').off('click').on('click', function() {
        $$.redirect('icenter/orderList.html?type=waitRevice');
    });
    
    // footer 事件
    $('#icenter_pageHome').on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch(type) {
            case 'index': {
                // 首页
                $$.redirect('home/index.html');
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
                //$$.redirect('icenter/pageHome.html');
            } break;
        }
    });
    $('#order_content_need_4').click(function() {
        $page.find('div.confirm').show();
    });
    $page.on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    $page.on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });
}());
