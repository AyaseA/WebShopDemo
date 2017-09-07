!(function(){
	var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_pageHome'),
        pageStr = 'icenter_pageHome';

    $page.find('>div.main').height(
        bodyHeight * 0.99 - $page.find('>div.footer').height() - $page.find('>header').height() - 1
    );

    //个人信息
    $('.personal_info').off('click').on('click', function() {
        if ($(this).find('.user_name').attr('data-islogin') == 1) {
            $$.redirect('icenter/info.html');
        } else {
            if (navigator.userAgent.indexOf('csl-ios') != -1) {
                var fullUrl = location.href;
                    fullUrl = fullUrl.indexOf('?') != -1 ? fullUrl.split('?')[0] + '?R=' : fullUrl + '?R=',
                    page = fullUrl + escape($$.getUrl()),
                    prevPage = fullUrl + escape($$.stack.getLast() || 'home/index.html');
                wx.showLoginPage({
                    'page': page,
                    'prevPage': prevPage,
                    'noConfirm': true
                });
            } else if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
                $$.redirect('home/wechatLogin.html');
            } else if (navigator.userAgent.indexOf('csl-android') != -1) {
                wx.showLoginPage({
                    'page': page,
                    'prevPage': prevPage
                });
            } else {
                $$.redirect('icenter/login.html');
            }
        }
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
        layer.msg('即将开放，敬请期待~');
        return false;
        $$.redirect('icenter/bin.html');
    });
    //意见反馈
    $('#advice').on('click', function() {
        $$.redirect('icenter/advice.html');
    });  
    //退换/售后
    $('#order_img_span_5').on('click', function() {
        $$.redirect('icenter/commitList.html');
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

    // 预约
    $('#article_con_tent2').off('click').on('click', function() {
        $$.redirect("icenter/appointmentList.html");
    });
    $('#order_img_span_6').off('click').on('click', function() {
        $$.redirect("icenter/appointmentList.html?type=commission");
    });
    $('#order_img_span_7').off('click').on('click', function() {
        $$.redirect("icenter/appointmentList.html?type=appointed");
    });
    $('#order_img_span_8').off('click').on('click', function() {
        $$.redirect("icenter/appointmentList.html?type=confirm");
    });
    $('#order_img_span_9').off('click').on('click', function() {
        $$.redirect("icenter/appointmentList.html?type=complete");
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
                location.href=$$.config.hostAddr+'Utilities/qr_ad/removeCar.html';
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
