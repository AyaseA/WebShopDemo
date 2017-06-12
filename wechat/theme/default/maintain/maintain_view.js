$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#maintain_maintain'),
	    pageStr = 'maintain_maintain';
	
	$page.find('div.products').height(
		bodyHeight - 81
	);
	
	// 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));
    
    // 点击跳转到商品详情
    $page.on('click', 'div.products >div.item', function() {
        var pid = $(this).attr('data-id');
        $$.redirect('product/product.html?pid=' + pid);
    });
    $page.on('click', 'div.products >div.item >div >a', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $$.redirect($(this).attr('href'));
    });
});