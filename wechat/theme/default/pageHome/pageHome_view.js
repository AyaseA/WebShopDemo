!(function(){
	
	var $page = $('#pageHome_pageHome'),
        pageStr = 'pageHome_pageHome';

    
	// footer 事件
    $page.on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch(type) {
            case 'index': {
                // 首页
                $$.redirect('index/index.html');
            } break;
            case 'luckyDraw': {
                // 幸运抽奖
                $$.redirect('luckyDraw/luckyDraw.html');
            } break;
            case 'center': {
                // 个人中心
                $$.redirect('pageHome/pageHome.html');
            } break;
        }
    });
    //个人信息
    $('.user_name').on('click', function() {
        $$.redirect('information/information.html');
    });    
    //邀请有礼
    $('#head_active_1').on('click', function() {
        $$.redirect('invite/invite.html');
    });
    //加油卡
    $('#head_active_2').on('click', function() {
        $$.redirect('gas/gas.html');
    });
    //我的车辆
    $('#head_active_3').on('click', function() {
        $$.redirect('myCars/myCars.html');
    });
    //积分
    $('#reward').on('click', function() {
        $$.redirect('reward/reward.html');
    });
    //vip
    $('.header_vip').on('click', function() {
        $$.redirect('vip/vip.html');
    });
    //我的收藏
    $('#my_cover').on('click', function() {
        $$.redirect('storefront/storefront.html');
    });
    //商品列表
    $('#article_con_tent').on('click', function() {
        $$.redirect('orderList/orderList.html');
    });   
    //设置
    $('#login_set_out').on('click', function() {
        $$.redirect('logout/logout.html');
    });
    //优惠券
    $('#content_account_wrap').on('click', function() {
        $$.redirect('discount/discount.html');
    });
    //我的钱包
    $('#wallet').on('click', function() {
        $$.redirect('myWallet/myWallet.html');
    });    
    //我的足迹
    $('#footprint').on('click', function() {
        $$.redirect('footprint/footprint.html');
    });     
    //势力币
    $('#bin').on('click', function() {
        $$.redirect('bin/bin.html');
    });
    //意见反馈
    $('#advice').on('click', function() {
        $$.redirect('advice/advice.html');
    });  
    //退换/售后
    $('#order_img_span_5').on('click', function() {
        $$.redirect('afterService/afterService.html');
    });     
    //跳转订单_______TODO
    $('.order_img_span').on('click', function() {
        $$.redirect('orderList/orderList.html');
    });
}());
