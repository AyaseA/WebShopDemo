$(function () {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#icenter_orderDetail'),
        pageStr = 'icenter_orderDetail',
        headerHeight = $page.find('>div.header').height(),
        orderId = $$.getQueryString('oid'),
        orderType = $$.getQueryString('type');

    $page.off('click', 'div.product a.contactService').on('click','div.product a.contactService', function() {
        var tel = $(this).attr('data-tel') || '0531-85523333';
        $page.find('div.confirm').show()
             .find('p').text(tel)
             .end().find('a.confirm').attr('href', 'tel:' + tel);
    });
    $page.off('click', 'div.confirm, div.confirm button.cancel')
        .on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    $page.off('click', 'div.confirm >div').on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });
    $page.off('click', 'button.cancelOrder').on('click', 'button.cancelOrder', function() {
        layer.confirm('确认取消订单？', { icon: 3, title: '提示' }, function(index) {
            cancelOrder();
            layer.close(index);
        });
    });

    // 设置返回按钮可用
    $page.off('click', '>div.header >a.goBack')
         .on('click', '>div.header >a.goBack', function() {
        $$.redirect('icenter/orderList.html?type=' + orderType, {
            fromGoBack: true
        });
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
                	var d = res.Data,
                        productInfo = JSON.parse(d.Data);
                	total = d.OutPocket;
                	$page.find('>div.main').html(template(pageStr + '_detail', {
                        serverAddr: $$.config.serverAddr,
                		proList: productInfo,
                        oData: d,
                        isPayed: $.inArray(d.StatusID, ['1', '5', '8', '10']) == -1,
                		discountMoney: (parseFloat(d.Discount) +
                		                parseFloat(d.ValueVoucherNum) +
                		                parseFloat(d.RewardPointNum) +
                		                parseFloat(d.GiftVoucherNum)).toFixed(2)
                	}));
                    var canCancel = $.inArray(d.StatusID, ['1'/*, '2', '3', '4', '8', '10'*/]) != -1,
                        canPay = $.inArray(d.StatusID, ['1', '8', '10']) != -1,
                        canReBuy = $.inArray(d.StatusID, ['5']) != -1;
                    // 设置底部按钮
                    $page.find('>div.footer').html(template(pageStr + '_footer', {
                        oData: d,
                        canPay: canPay,
                        canCancel: canCancel,
                        canReBuy: canReBuy,
                        d: d,
                        productInfo: productInfo
                    }));
                }
			}
		);
	}
    // 取消订单
    function cancelOrder() {
        $$.post(
            'CSL/Order/CancelOrder',
            {
                ID: orderId
            },
            function(res) {
                if (res.Status == 0 && res.Data == 'succ') {
                    layer.msg('订单取消成功！');
                    getOrderDetail();
                }
            }
        );
    }
});