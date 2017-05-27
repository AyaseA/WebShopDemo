!(function(win, $, undefined) {
	var headerSearch = $.extend(win.App.headerSearch || {}, {
		init: function(headerParam) {
			var $header = $('body >header');
			$header.on('click', 'a.location', function() {
				App.index.showCitiesModal();
			});
			$header.find('a.location >span').text(App.location.city);
		},
		setLocation: function(location) {
			var $headerTitle = $('body >header >a.location >span');
	    	if ($headerTitle) {
	    		$headerTitle.text(location);
	    	}
		}
	});
	win.App.headerSearch = headerSearch;
}(window, jQuery));