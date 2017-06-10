$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#maintain_maintain'),
	    pageStr = 'maintain_maintain';
	
	$page.find('div.products').height(
		bodyHeight - 81
	);
	
	// 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));
    
	// 点击图片跳转到商品详情
    $page.on('click', 'div.products >div.item >img', function() {
        var pid = $(this).parent().attr('data-id');
        $$.redirect('product/product.html?pid=' + pid);
    });
});