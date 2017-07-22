$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_orderDetail'),
        pageStr = 'icenter_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        orderId = $$.getQueryString('oid');

    $page.off('click', 'div.product a.contactService').on('click','div.product a.contactService', function() {
        $page.find('div.confirm').show();
    });
    $page.off('click', 'div.confirm, div.confirm button.cancel')
        .on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    $page.off('click', 'div.confirm >div').on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
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