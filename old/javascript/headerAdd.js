!(function(win, $, undefined) {
	var headerAdd = $.extend(win.App.headerAdd || {}, {
		init: function(headerParam) {
			var title = win.App.constants[headerParam];
			$('body >header >span.title').text(title || '');
		}
	});
	win.App.headerAdd = headerAdd;
}(window, jQuery));