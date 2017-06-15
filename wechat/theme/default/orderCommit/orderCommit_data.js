$(function() {
	var $page = $('#orderCommit_orderCommit'),
        pageStr = 'orderCommit_orderCommit',
        orderId = 157//$$.getQueryString('oid');

    // 获取订单详情
	getOrderDetail();
	function getOrderDetail() {
		$$.post(
			'CSL/Order/QueryOrderDetail',
			{
				'ID': orderId
			},
			function(res) {
				if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                	var d = res.Data;
                	$page.find('>div.main >div.product').html(template(pageStr + '_product', {
                		cProList: JSON.parse(d.Data),
                		serverAddr: $$.config.serverAddr
                	}));
                }
			}
		);
	}
});