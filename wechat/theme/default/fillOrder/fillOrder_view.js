$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#fillOrder_fillOrder'),
    	pageStr = 'fillOrder_fillOrder',
	    headerHeight = $page.find('>div.header').height(),
	    footerHeight = $page.find('>div.footer').height(),
	    boxWidht = $page.find('>div.header').width();
	// 设置各种高度
	$page.find('>div.main').css({
		'height': bodyHeight - headerHeight - footerHeight - 10,
		'top': headerHeight
	});
	$page.find('>div.couponModal').css({
		'top': 0//bodyHeight
		,'display':'block'
	}).find('>div.content').css({
		'height': bodyHeight - headerHeight * 2 - 1,
		'width': boxWidht
	});
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
});