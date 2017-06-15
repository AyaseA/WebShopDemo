$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#orderDetail_orderDetail'),
        pageStr = 'orderDetail_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        orderId = $$.getQueryString('oid');

    // 设置footer按钮的id
    $page.find('>div.footer').html(template(pageStr + '_footer', {
		orderId: orderId
	}));

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
                	$page.find('>div.main').html(template(pageStr + '_detail', {
                		proList: JSON.parse(d.Data),
                		payMoney: d.OutPocket,
                		allMoney: d.AllMoney,
                		orderNum: d.ID,
                		orderTime: d.AddTime,
                		discountMoney: (parseFloat(d.Discount) +
                		                parseFloat(d.ValueVoucherNum) +
                		                parseFloat(d.RewardPointNum) +
                		                parseFloat(d.GiftVoucherNum)).toFixed(2)
                	}));
                	/*orderDesc = $.trim($page.find('div.productInfo p.desc').text().replace(/[\r\n]/g, "").replace(/[\t]/g, ""));
                	if (orderDesc.length > 50) {
                		orderDesc.substring(0, 50);
                	}*/
                }
			}
		);
	}
});