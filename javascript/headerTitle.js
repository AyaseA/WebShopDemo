!(function(win, $, undefined) {
	var headerTitle = $.extend(win.App.headerTitle || {}, {
		init: function(headerParam) {
			var title = win.App.constants[headerParam];
			$('body >header >span.title').text(title || '');
			$('body >header >a.goBack').click(function(e) {
				var isPayCenter = location.hash.indexOf('payCenter') != -1;
				if (isPayCenter) {
					App.common.confirm('', '订单还未支付，确认退出吗？', function() {
						history.go(-1);
					});
				} else {
					history.go(-1);
				}
			});
		}
	});
	win.App.headerTitle = headerTitle;
}(window, jQuery));