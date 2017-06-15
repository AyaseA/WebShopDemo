$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#fillOrder_fillOrder'),
    	pageStr = 'fillOrder_fillOrder',
    	productId = $$.getQueryString('pid'),
    	productNum = $$.getQueryString('num') || 1,
    	total = 0,
    	coupon = 0;

	// 页面重新显示的一些初始化
	$page.find('div.coupon button')
		 .removeClass('selected')
		 .text('选择优惠券');
	$page.find('div.proMoney >p:last-child >span')
		 .text('-￥0.00');
	$page.find('>div.couponModal').css({
			'top': bodyHeight,
			'display': 'none'
	   }).find('div.usable div.ticket')
		 .removeClass('checked');
	$page.find('>div.couponModal button.selectTicket').hide();
	$page.find('>div.footer >button.order').addClass('disabled');

	// 立即支付
	$page.off('click', '>div.footer >button.order').on('click', '>div.footer >button.order', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		}
		addOrder(function(oid) {
			$$.redirect('payCenter/payCenter.html?oid=' + oid);
		});
	});

	// 获取商品详情
	getProductDetail();
	function getProductDetail() {
		$$.get(
			'Product/Prod/QueryDetail?ID=' + productId,
			function(res) {
				if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                	var d = res.Data;
                	total = d.Price;
					$page.find('>div.main >div.productInfo').html(
                        template(pageStr + '_product_detail', {
                            serverAddr: $$.config.serverAddr,
                            data: d,
                            count: productNum
                    }));
					setMoney();
                	$page.find('>div.footer >button.order').removeClass('disabled');
                }
			}
		);
	}
	// 设置页面金额
	function setMoney() {
		$page.find('>div.main >div.proMoney').html(
            template(pageStr + '_price_coupon', {
                total: total,
                coupon: coupon
        }));
        $page.find('>div.footer >span').text(parseFloat(total - coupon).toFixed(2));
	}
	// 添加订单
	function addOrder(calback) {
		$$.post(
			'CSL/Order/AddOrder',
			{
				'ProdList': productId + '_' + productNum
			},
			function(res) {
				if (res.Status != 0) {
                    return false;
                }
                if (res.Data && res.Data.ID && calback) {
                	calback(res.Data.ID);
                }
			}
		);
	}
});