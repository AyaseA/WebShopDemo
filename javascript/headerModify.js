!(function(win, $, undefined) {
	var headerModify = $.extend(win.App.headerModify || {}, {
		init: function(headerParam) {
			var $header = $('body >header');
			// 获取默认车型
			$header.find('>span.edit').text('雪弗兰 爱唯欧-三厢');
			// 更改车型
			$header.find('>a.modify').click(function() {
				App.maintain.showChangeCarModal();
			});
		}
	});
	win.App.headerModify = headerModify;
}(window, jQuery));