$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#home_maintain'),
	    pageStr = 'home_maintain';
	// 设置高度
	$page.find('div.warp').height(
		bodyHeight - 81
	);
	// 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));
    // 修改车辆事件
    $page.on('click dbclick', '>div.header >a.modify', function() {
        $$.redirect('home/myCars.html', {
            fromGoBack: true
        });
    });
    // 点击跳转到商品详情
    $page.on('click dbclick', 'div.products >div.item', function() {
        var pid = $(this).attr('data-id'),
            type = $(this).attr('data-type') || 0;
        if (type == 1) {
            $$.redirect('home/prodservice.html?pid=' + pid);
        } else if (type == 5) {
            $$.redirect('home/prodmulti.html?pid=' + pid);
        } else if (type == 0) {
            $$.redirect('home/product.html?pid=' + pid);
        }
    });
    $page.on('click dbclick', 'div.products >div.item >div >a', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $$.redirect($(this).attr('href'));
    });
});