$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#home_activity'),
    	pageStr = 'home_activity',
    	headerHeight = $page.find('>div.header').height();

    // 设置高度
    $page.find('div.main').css({
        'height': bodyHeight - headerHeight - 1
    });
    // 点击顶部的提示到我的车辆页面
    $page.on('click', 'div.main div.info', function() {
    	$$.redirect('home/myCars.html');
    });
    // 点击跳转到商品详情
    $page.on('click', 'div.products >div.item', function() {
        var pid = $(this).attr('data-id');
        $$.redirect('home/product.html?pid=' + pid);
    });
    $page.on('click', 'div.products >div.item >div >a', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $$.redirect($(this).attr('href'));
    });
});