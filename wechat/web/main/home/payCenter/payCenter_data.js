$(function() {
    var $page = $('#home_payCenter'),
	    pageStr = 'home_payCenter',
	    orderId = $$.getQueryString('oid'),
	    orderDesc = '车势力-订单编号：' + orderId,
	    total = 0,
	    isWx = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i) != null;

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
                	total = d.OutPocket;
                	$page.find('>div.main >div.warp').html(template(pageStr + '_detail', {
                		proList: JSON.parse(d.Data),
                		payMoney: d.OutPocket,
                		allMoney: d.AllMoney,
                		valueVoucher: d.ValueVoucherNum,
                		isWx: isWx
                	}));
                }
			}
		);
	}
	// 支付
	function confirmToPay() {
		location.href = $$.config.serverAddr +
			'CSL/' + (isWx ? 'W' : 'A') + '_Pay/Pay?OrderID=' + orderId +
			'&OrderDesc=' + orderDesc +
			'&WToken=' + $$.getToken() +
			'&Total=' + total;
	}
});