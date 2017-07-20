!(function(){
	if ($$.isLogin(true)) {
		var token = $$.getToken();
		$('.user_name').html($$.getUserMobile());
		var $page = $('#icenter_pageHome'),
	        pageStr = 'icenter_pageHome';
		var resImg = $$.getUserInfo();//获取头像
		$('#icenter_pageHome .img_icon').attr('src', 
			(resImg.Img ? ($$.config.serverAddr + resImg) : './images/icon.png')
		);
		getICenterInfo();
		function getICenterInfo() {
			$$.post(
				'CSL/User/QueryICenterInfo',
				{},
				function(res) {
					if (res.Status == 0) {
						var d = res.Data;
						d.OrderStatus.forEach(function(item) {
							d['OrderStatus' + item.StatusID] = item.Count;
						});
						$("#icenter_pageHome").find('article').html(
							template('icenter_pageHome_infos', {
								d: res.Data
							})
						);
					}
					bindEvent();
				}
			);
		}
		function bindEvent() {
			//个人信息
		    $('.user_name').off('click').on('click', function() {
		        $$.redirect('icenter/information.html');
		    });    
		    //邀请有礼
		    $('#head_active_1').off('click').on('click', function() {
		        $$.redirect('home/recommend.html');
		    });
		    //加油卡
		    $('#head_active_2').off('click').on('click', function() {
		        $$.redirect('icenter/gas.html');
		    });
		    //我的车辆
		    $('#head_active_3').off('click').on('click', function() {
		        $$.redirect('home/myCars.html');
		    });
		    //积分
		    $('#reward').off('click').on('click', function() {
		        layer.msg('即将开放，敬请期待~');
		        return false;
		        $$.redirect('icenter/reward.html');
		    });
		    //vip
		    $('.header_vip').off('click').on('click', function() {
		        $$.redirect('icenter/vip.html');
		    });
		    //我的收藏
		    $('#my_cover').off('click').on('click', function() {
		        $$.redirect('icenter/storefront.html');
		    });
		    //商品列表
		    $('#article_con_tent').off('click').on('click', function() {
		        $$.redirect('icenter/orderList.html');
		    });   
		    //设置
		    $('#login_set_out').off('click').on('click', function() {
		        $$.redirect('icenter/logout.html');
		    });
		    //优惠券
		    $('#content_account_wrap').off('click').on('click', function() {
		        $$.redirect('icenter/discount.html');
		    });
		    //我的钱包
		    $('#wallet').off('click').on('click', function() {
		        $$.redirect('icenter/myWallet.html');
		    });    
		    //我的足迹
		    $('#footprint').off('click').on('click', function() {
		        $$.redirect('icenter/footprint.html');
		    });     
		    //势力币
		    $('#bin').off('click').on('click', function() {
		        $$.redirect('icenter/bin.html');
		    });
		    //意见反馈
		    $('#advice').off('click').on('click', function() {
		        $$.redirect('icenter/advice.html');
		    });  
		    //退换/售后
		    $('#order_img_span_5').off('click').on('click', function() {
		        $$.redirect('icenter/afterService.html');
		    });     
		    //跳转订单_______TODO
		    $('.order_img_span:not(#order_img_span_5)').off('click').on('click', function() {
		        $$.redirect('icenter/orderList.html');
		    });

		    
		    $('#order_content_need_4').off('click').on('click', function() {
		        $page.find('div.confirm').show();
		    });
		    $page.off('click', 'div.confirm, div.confirm button.cancel')
		    	.on('click', 'div.confirm, div.confirm button.cancel', function() {
		        $page.find('div.confirm').hide();
		    });
		    $page.off('click', 'div.confirm >div').on('click', 'div.confirm >div', function(e) {
		        e.stopPropagation();
		    });
		}
	}
}());