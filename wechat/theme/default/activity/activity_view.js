$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#activity_activity'),
    	pageStr = 'activity_activity',
    	headerHeight = $page.find('>div.header').height();

    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));

    // 设置高度
    $page.find('div.main').css({
        'height': bodyHeight - headerHeight + 'px',
        'margin-top': headerHeight + 'px'
    });
    // 点击顶部的提示到我的车辆页面
    $page.on('click', 'div.main div.info', function() {
    	$$.redirect('myCars/myCars.html?' + $$.goBackUrl());
    });
    // 点击图片跳转到商品详情
    $page.on('click', 'div.products >div.item >img', function() {
        var pid = $(this).parent().attr('data-id');
        $$.redirect('product/product.html?pid=' + pid + '&' + $$.goBackUrl());
    });
});