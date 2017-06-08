$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#fillOrder_fillOrder'),
    	pageStr = 'fillOrder_fillOrder';

	// 页面重新显示的一些初始化
	$page.find('div.coupon button')
		 .removeClass('selected')
		 .text('选择优惠券');
	$page.find('div.proMoney >p:last-child >span')
		 .text('-￥0.00');
	$page.find('>div.couponModal').css({
			'top': bodyHeight,
			'display': 'none'
	   }).find('div.usable div.ticket')
		 .removeClass('checked');
	$page.find('>div.couponModal button.selectTicket').hide();
});