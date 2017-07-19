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
        $$.redirect('icenter/invite.html');
    });
    //加油卡
    $('#head_active_2').on('click', function() {
        $$.redirect('icenter/gas.html');
    });
    //我的车辆
    $('#head_active_3').on('click', function() {
        $$.redirect('icenter/myCars.html');
    });
    //积分
    $('#reward').on('click', function() {
        $$.redirect('icenter/reward.html');
    });
    //vip
    $('.header_vip').on('click', function() {
        $$.redirect('icenter/vip.html');
    });
    //我的收藏
    $('#my_cover').on('click', function() {
        $$.redirect('icenter/storefront.html');
    });
    //商品列表
    $('#article_con_tent').on('click', function() {
        $$.redirect('icenter/orderList.html');
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
    //跳转订单_______TODO
    $('.order_img_span:not(#order_img_span_5)').on('click', function() {
        $$.redirect('icenter/orderList.html');
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
                $$.redirect('campaign/activity/luckyDraw.html');
            } break;
            case 'center': {
                // 个人中心
                //$$.redirect('icenter/pageHome.html');
            } break;
        }
    });
}());
