!(function(win, $, undefined) {
	var headerModify = $.extend(win.App.headerModify || {}, {
		init: function(headerParam) {
			var $header = $('body >header');
			var title = win.App.constants[headerParam];
			if (!title) {
				title = localStorage.getItem('titleModify');
			}
			// 获取默认车型
			$header.find('>span.edit').text(title || '');
			// 更改车型
			$header.find('>a.modify').click(function() {
				win.App.maintain.showChangeCarModal();
			});
		}
	});
	win.App.headerModify = headerModify;
}(window, jQuery));