!(function(win, $, undefined) {
    var paySucc = $.extend(win.App.paySucc || {}, {
        init: function(param) {
            var $paySucc = $('#paySucc');
            var pArr = param.split(',');
            // 右上角完成
            $paySucc.find('>h5 >a').click(function() {
            	
            });
            // 查看订单
            $paySucc.find('button.checkOrder').click(function() {

            });
            // 返回首页
            $paySucc.find('button.goHome').click(function() {
            	location.hash = "";
            });
        }
    });
    win.App.paySucc = paySucc;
}(window, jQuery));