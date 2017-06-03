!(function(win, $, undefined) {
    var payCenter = $.extend(win.App.payCenter || {}, {
        init: function(param) {
            var $payCenter = $('#payCenter');

            //a:产品id1|产品id2|产品id3,b:产品数量1|产品数量2|产品数量3,c:车牌


            // 获取商品详细
            getProductDetail($payCenter, param);
            // 默认
        	$payCenter.find('>div.payMode >div').click(function() {
        		var $this = $(this);
                if ($this.hasClass('selected')) {
                    return false;
                }
                $this.addClass('selected');
                $this.siblings().removeClass('selected');
        	});
            // 支付
            $payCenter.find('>button').click(function() {
                getOrder($(this));
            });
        }
    });
    function getOrder(item) {
        var pid = item.attr('pid'),
            count = 1,
            carNo = sessionStorage.getItem('carNo');
        $.ajax({
            url: win.App.request.serverAddr + 'CSL/Order/AddOrder',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                Token: win.App.token(),
                Data: JSON.stringify({
                    carNo: carNo || ''
                }),
                ProdList: pid + '_' + count
            })
        }).success(function(res) {
            if (res && res.Data && res.Data.ID) {
                getWechatPay(res.Data.ID);
            } else {
                console.log("获取订单信息失败！");
            }
        });
    }
    function getWechatPay(oid) {
        var $payCenter = $('#payCenter'),
            desc = $payCenter.find('div.productInfo p.desc').text(),
            price = $payCenter.find('div.payMoney p').attr('price');
        $.ajax({
            url: win.App.request.serverAddr + 'Product/Info/GetWeChatPay?OrderID=' + oid +
                                          '&OrderDesc=' + desc +
                                          '&Total=' + price +
                                          '&Token=' + win.App.token(),
            type: 'GET'
        }).success(function(res) {
            if (res) {
                window.open(res, '_self');
            } else {
                console.log('支付失败！');
            }
        });
    }
    // 获取商品详细
    function getProductDetail($payCenter, proId) {
        $payCenter.find('div.productInfo p, div.payMoney p').empty();
        $.ajax({
            url: win.App.request.serverAddr + 'Product/Prod/QueryDetail?ID=' + proId,
            type: 'GET',
            dataType: 'json'
        }).success(function(res) {
            if (res.Status != 0) {
                console.log('获取商品详细失败');
                return false;
            }
            if (res.Data) {
                var d = res.Data;
                $payCenter.find('div.productInfo p:eq(0)').text('车势力');
                $payCenter.find('div.productInfo p:eq(1)').text(d.Name);
                $payCenter.find('div.productInfo p.desc').text(d.Descri);
                $payCenter.find('div.productInfo p:eq(3)').text('￥' + d.Price);
                $payCenter.find('div.payMoney p').text('￥' + d.Price).attr('price', d.Price.replace('.', ''));

                $payCenter.find('>button')
                    .attr('pid', d.ID);
            }
        }).error(function(e) {

        });
    }
    win.App.payCenter = payCenter;
}(window, jQuery));
