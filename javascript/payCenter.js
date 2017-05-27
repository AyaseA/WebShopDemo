!(function(win, $, undefined) {
    var payCenter = $.extend(win.App.payCenter || {}, {
        init: function(param) {
            var $payCenter = $('#payCenter');
            // 获取商品详细
            getProductDetail($payCenter, param);

        	$payCenter.find('>div.payMode >div').click(function() {
        		var $this = $(this);
                if ($this.hasClass('selected')) {
                    return false;
                }
                $this.addClass('selected');
                $this.siblings().removeClass('selected');
        	});
        }
    });
    // 获取商品详细
    function getProductDetail($payCenter, proId) {
        $payCenter.find('div.productInfo p, div.payMoney p').empty();
        $.ajax({
            url: App.request.serverAddr + 'Product/Prod/QueryDetail?ID=' + proId,
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
                $payCenter.find('div.productInfo p:eq(2)').text(d.Descri);
                $payCenter.find('div.productInfo p:eq(3)').text('￥' + d.Price);
                $payCenter.find('div.payMoney p').text('￥' + d.Price);
            }
        }).error(function(e) {

        });
    }
    win.App.payCenter = payCenter;
}(window, jQuery));
