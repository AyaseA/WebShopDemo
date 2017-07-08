$(function() {
    var $page = $('#home_activity'),
    	pageStr = 'home_activity';

	// 加载商品列表
	getProductsList();
	
	// 加载商品列表
	function getProductsList() {
		var $proBox = $page.find('div.products').empty();
		$$.get(
			'Product/Prod/QueryList',
			function(res) {
				if (res.Status != 0) {
					console.log('获取商品信息失败');
					return false;
				}
				if (res.Data && res.Data.Rows && res.Data.Rows.length > 0) {
					var d = res.Data.Rows;
					$proBox.html(template(pageStr + '_products', {
						list: d,
						serverAddr: $$.config.serverAddr
					}));
				}
			}
		);
	}
});