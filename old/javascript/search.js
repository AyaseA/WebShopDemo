!(function(win, $, undefined) {
	var search = $.extend(win.App.search || {}, {
		init: function(param) {
            var $search = $('#search');
            $search.find('input[name=searchWord]').focus();
		}
	});
	win.App.search = search;
}(window, jQuery));