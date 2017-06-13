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
    //vip
    $('.header_vip').on('click', function() {
        $$.redirect('vip/vip.html');
    });
    //我的收藏
    $('#my_cover').on('click', function() {
        $$.redirect('storefront/storefront.html');
    });
    //商品列表
    $('#article_con_tent').on('click', function(){
        $$.redirect('orderList/orderList.html');
    });   
    //设置
    $('#login_set_out').on('click', function(){
        $$.redirect('logout/logout.html');
    });
    //优惠券
    $('#content_account_wrap').on('click', function(){
        $$.redirect('discount/discount.html');
    });
    //我的钱包
    $('#wallet').on('click', function(){
        $$.redirect('myWallet/myWallet.html');
    });    
    //我的足迹
    $('#footprint').on('click', function(){
        $$.redirect('footprint/footprint.html');
    });     
    //势力币
    $('#bin').on('click', function(){
        $$.redirect('bin/bin.html');
    });
    //意见反馈
    $('#advice').on('click', function(){
        $$.redirect('advice/advice.html');
    });      
    //跳转订单_______TODO
    $('.order_img_span').on('click', function(){
        $$.redirect('orderList/orderList.html');
    });
}());


 