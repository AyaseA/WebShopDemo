$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#orderDetail_orderDetail'),
        pageStr = 'orderDetail_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        orderId = $$.getQueryString('oid');

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
                    d.StatusID = '10';
                	total = 1;//d.OutPocket;
                	$page.find('>div.main').html(template(pageStr + '_detail', {
                        serverAddr: $$.config.serverAddr,
                		proList: JSON.parse(d.Data),
                        oData: d,
                        isPayed: $.inArray(d.StatusID, ['1', '5', '8', '10']) == -1,
                		discountMoney: (parseFloat(d.Discount) +
                		                parseFloat(d.ValueVoucherNum) +
                		                parseFloat(d.RewardPointNum) +
                		                parseFloat(d.GiftVoucherNum)).toFixed(2)
                	}));
                    var canCancel = $.inArray(d.StatusID, ['1', '2', '3', '4', '8', '10']) != -1,
                        canPay = $.inArray(d.StatusID, ['1', '8', '10']) != -1;
                    // 设置底部按钮
                    $page.find('>div.footer').html(template(pageStr + '_footer', {
                        orderId: orderId,
                        oData: d,
                        canPay: canPay,
                        canCancel: canCancel
                    }));
                }
			}
		);
	}
});