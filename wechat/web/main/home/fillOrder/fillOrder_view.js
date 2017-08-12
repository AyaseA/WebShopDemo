$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#home_fillOrder'),
    	pageStr = 'home_fillOrder',
	    boxWidth = $page.find('>div.header').width(),
	    headerHeight = $page.find('>div.header').height(),
	    footerHeight = $page.find('>div.footer').height();

	$page.find('>div.couponModal').css({
		'top': bodyHeight
	}).find('>div.content').css({
		'height': bodyHeight - headerHeight * 2 - 1,
		'width': boxWidth
	}).find('>div.warp').css({
		'height': bodyHeight - headerHeight * 2 - 1,
		'width': boxWidth * 2
	}).find('>div').css({
		'height': bodyHeight - headerHeight * 2 - 1,
		'width': boxWidth
	});


/*
	if (navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.main').css({
        	'top': '64px'
        }).end().find('>div.header').height(64).find('a, span').css({
            'bottom': 0
        });
        $page.find('>div.couponModal').find('div.title').height(64)
        	.end().find('>ul').css({
        		'top': '65px'
        	})
        	.end().find('>div.content').css({
        		'top': '110px',
        		'height': bodyHeight - 110
        	});
    }
*/

	// 设置各种高度
	$page.find('>div.main').css({
		'height': bodyHeight - headerHeight - footerHeight,
	});

	// 设置返回页面
	$$.setGoBack($page.find('>div.header >a.goBack'));
	
	// 点击优惠券按钮弹出优惠券框
	$page.on('click', 'div.coupon button', function() {
		$page.find('>div.couponModal').show().animate({
			'top': 0
		}, 300);
	});
	// 关闭弹框
	$page.on('click', '>div.couponModal a.closeModal', function() {
		$page.find('>div.couponModal').animate({
			'top': bodyHeight
		}, 300).fadeOut(400);
	});
	// tab切换
	$page.on('click', '>div.couponModal li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		changeTab($(this));
	});
	// 选择优惠券事件
	$page.on('click', '>div.couponModal div.usable div.ticket', function() {
		if ($(this).hasClass('checked')) {
			$(this).removeClass('checked');
		} else {
			$(this).addClass('checked').siblings().removeClass('checked');
		}
		$page.find('>div.couponModal button.selectTicket').css({
			'display': (
				$page.find('>div.couponModal div.usable div.ticket.checked').length > 0
				? 'block' : 'none')
		});
	});
	// 优惠券tab切换
	function changeTab(item) {
		$(item).addClass('active').siblings().removeClass('active');
		$page.find('>div.couponModal button.selectTicket').css({
			'display': (
				$(item).attr('data-type') == 'usable' &&
				$page.find('>div.couponModal div.usable div.ticket.checked').length > 0
				? 'block' : 'none')
		});
		$page.find('>div.couponModal div.warp').animate({
			'margin-left': - boxWidth * $(item).attr('data-index')
		}, 300);
	}
});