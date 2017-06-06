$(function() {
	var $page = $('#product_product'),
	    pageStr = 'product_product',
	    $product = $page.find('div.main div.product'),
	    $detail = $page.find('div.main div.detail'),
	    $evaluate = $page.find('div.main div.evaluate');

	$page.on('click', 'div.header li', function() {
		if ($(this).hasClass('active')) {
			return false;
		}
		$(this).addClass('active').siblings().removeClass('active');
		$page.find('div.content >div').hide();
		var type = $(this).attr('data-type');
		switch(type) {
			case 'product': {
				$product.show();
			} break;
			case 'detail': {
				$detail.show();
			} break;
			case 'evaluate': {
				$evaluate.show();
			} break;
		}
	});

});