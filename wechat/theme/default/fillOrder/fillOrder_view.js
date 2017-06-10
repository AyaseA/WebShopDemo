$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#fillOrder_fillOrder'),
    	pageStr = 'fillOrder_fillOrder',
	    headerHeight = $page.find('>div.header').height(),
	    footerHeight = $page.find('>div.footer').height(),
	    boxWidth = $page.find('>div.header').width();
	// 设置各种高度
	$page.find('>div.main').css({
		'height': bodyHeight - headerHeight - footerHeight - 10,
		'top': headerHeight
	});
	$page.find('>div.couponModal').css({
		'top': bodyHeight
	}).find('>div.content').css({
		'height': bodyHeight - headerHeight * 2 - 1,
		'width': boxWidth
	}).find('>div.warp').css({
		'height': bodyHeight - headerHeight * 2 - 1,
		'width': boxWidth * 2
	}).find('>div').width(boxWidth - 30).height(bodyHeight - headerHeight * 2 - 20);

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
	// 点击确定选择优惠券
	$page.on('click', '>div.couponModal button.selectTicket', function() {
		var couponMoney = '100';
		$page.find('div.coupon button')
			 .removeClass(function() {
			 	return $(this).hasClass('selected') ? '' : 'selected';
			 })
			 .text('-￥' + couponMoney);
		$page.find('div.proMoney >p:last-child >span')
		 	 .text('-￥' + parseFloat(couponMoney).toFixed(2));
		 	 
		$page.find('>div.couponModal').animate({
			'top': bodyHeight
		}, 300).fadeOut(400);
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