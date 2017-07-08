$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#fillOrder_fillOrder'),
        pageStr = 'fillOrder_fillOrder',
        productId = $$.getQueryString('pid'),
        productNum = $$.getQueryString('num') || 1,
        total = 0,
        coupon = 0,
        point = 0;
    // 判断是否登录
    if ($$.isLogin(true)) {
        // 页面重新显示的一些初始化
        $page.find('>div.couponModal').css({
                'top': bodyHeight,
                'display': 'none'
            }).find('div.usable div.ticket')
            .removeClass('checked');
        $page.find('>div.couponModal button.selectTicket').hide();
        $page.find('>div.footer >button.order').addClass('disabled');

        // 优惠券积分
        setCoupon();
		// 获取商品详情
        getProductDetail();

        // 点击确定选择优惠券
        $page.off('click', '>div.couponModal button.selectTicket')
            .on('click', '>div.couponModal button.selectTicket', function() {
            total = total + 100;
	        coupon = coupon + 5;
	        point = point + 5;
            setCoupon();
            setMoney();
            $page.find('>div.couponModal').animate({
                'top': bodyHeight
            }, 300).fadeOut(400);
        });
        // 立即支付
        $page.off('click', '>div.footer >button.order').on('click', '>div.footer >button.order', function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            addOrder(function(oid) {
                $$.redirect('payCenter/payCenter.html?oid=' + oid);
            });
        });
    }
    // 获取商品详情
    function getProductDetail() {
        $$.get(
            'Product/Prod/QueryDetail?ID=' + productId,
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                    var d = res.Data;
                    total = parseFloat(d.Price);
                    $page.find('>div.main >div.productInfo').html(
                        template(pageStr + '_product_detail', {
                            'serverAddr': $$.config.serverAddr,
                            'data': d,
                            'count': productNum
                        }));
                    setMoney();
                    $page.find('>div.footer >button.order').removeClass('disabled');
                }
            }
        );
    }
    // 添加订单
    function addOrder(calback) {
        $$.post(
            'CSL/Order/AddOrder', {
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
    // 设置页面金额
    function setMoney() {
        $page.find('>div.main >div.proMoney').html(
            template(pageStr + '_price_coupon', {
                'total': parseFloat(total).toFixed(2),
                'coupon': parseFloat(coupon).toFixed(2)
            }));
        $page.find('>div.footer >span').text(parseFloat(total - coupon).toFixed(2));
    }
    // 优惠券积分
    function setCoupon() {
        $page.find('>div.main >div.coupon').html(template(pageStr + '_ticket_point', {
            'ticket': parseFloat(coupon).toFixed(2),
            'point': point
        }));
    }
});
