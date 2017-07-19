$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_fillOrder'),
        pageStr = 'home_fillOrder',
        productId = $$.getQueryString('pid'),
        productNum = $$.getQueryString('num') || 1,
        total = 0,
        coupon = 0,
        point = 0,
        couponID = '';
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
            var $ticket = $page.find('>div.couponModal div.usable div.ticket.checked');
	        coupon = parseFloat($ticket.attr('data-coupon'));
            couponID = $ticket.attr('data-id');
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
                $$.redirect('home/payCenter.html?oid=' + oid);
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
                    var d = res.Data,
                        descri = '';
                    if (d.Descri) {
                        d.Descri = JSON.parse(d.Descri);
                        descri = Base64.decode(unescape(d.Descri.text));
                    }
                    total = parseFloat(d.Price);
                    $page.find('>div.main >div.productInfo').html(
                        template(pageStr + '_product_detail', {
                            'serverAddr': $$.config.serverAddr,
                            'data': d,
                            'count': productNum,
                            'descri': descri
                        }));
                    setMoney();
                    $page.find('>div.footer >button.order').removeClass('disabled');
                    getValueVoucher();
                }
            }
        );
    }
    // 优惠券
    function getValueVoucher() {
        $$.post(
            'CSL/User/QueryValueVoucherJson',
            {},
            function(res) {
                if (res.Status != 0) {
                    return false;
                }
                if (res.Data) {
                    var usableCoupons = [],
                        disabledCoupons = [],
                        nowTime = new Date().pattern('yyyy-MM-dd');
                    res.Data.Status0.forEach(function(item) {
                        item = JSON.parse(item.DataVoucherData);
                        var coupon = {
                            ID: item.ID,
                            Name: item.Name,
                            Descri: item.Descri,
                            AboveNum: item.AboveNum,
                            Discount: item.Discount,
                            TimeStart: $$.timeToStr(item.TimeStart),
                            TimeEnd: $$.timeToStr(item.TimeEnd)
                        };
                        if (coupon.AboveNum <= total &&
                            nowTime >= coupon.TimeStart &&
                            nowTime <= coupon.TimeEnd) {
                            usableCoupons.push(coupon);
                        } else {
                            disabledCoupons.push(coupon);
                        }
                    });
                    res.Data.Status1.forEach(function(item) {
                        item = JSON.parse(item.DataVoucherData);
                        disabledCoupons.push({
                            ID: item.ID,
                            Name: item.Name,
                            Descri: item.Descri,
                            AboveNum: item.AboveNum,
                            Discount: item.Discount,
                            TimeStart: $$.timeToStr(item.TimeStart),
                            TimeEnd: $$.timeToStr(item.TimeEnd)
                        });
                    });
                    $page.find('div.couponModal div.usable').html(
                        template(pageStr + '_coupon_item', {
                            list: usableCoupons,
                            enable: true
                        })
                    );
                    $page.find('div.couponModal div.disabled').html(
                        template(pageStr + '_coupon_item', {
                            list: disabledCoupons,
                            enable: false
                        })
                    );
                }
            }
        );
    }
    // 添加订单
    function addOrder(calback) {
        $$.post(
            'CSL/Order/AddOrder', {
                'ProdList': productId + '_' + productNum,
                'ValueVoucherID': couponID,
                'ValueVoucherNum': coupon
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
                'coupon': coupon
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
