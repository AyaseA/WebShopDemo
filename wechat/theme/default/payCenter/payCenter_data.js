$(function() {
    var $page = $('#payCenter_payCenter'),
	    pageStr = 'payCenter_payCenter',
	    orderId = $$.getQueryString('oid'),
	    orderDesc = '',
	    total = 0;

	$page.find('div.confirm').hide();

	$page.off('click', '>div.main >div.warp >button').on('click', '>div.main >div.warp >button', function() {
		confirmToPay();
	});
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
                	total = 1;//d.OutPocket;
                	$page.find('>div.main >div.warp').html(template(pageStr + '_detail', {
                		proList: JSON.parse(d.Data),
                		payMoney: d.OutPocket,
                		allMoney: d.AllMoney
                	}));
                	orderDesc = $.trim($page.find('div.productInfo p.desc').text().replace(/[\r\n]/g, "").replace(/[\t]/g, ""));
                }
			}
		);
	}
	// 支付
	function confirmToPay() {
		$.ajax({
			url: $$.config.serverAddr + 'Product/WeChat/GetWeChatPay?OrderID=' + orderId +
										 '&Total=' + total +
										 '&OrderDesc=' + orderDesc,
			type: 'GET',
			success: function(res) {
		        alert(res);
				if (res) {
					location.href = res;
	                //window.open(res, '_self');
	            } else {
	                console.log('支付失败！');
	            }
		    }
		});
	}
});