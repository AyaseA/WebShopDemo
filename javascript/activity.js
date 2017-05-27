!(function(win, $, undefined) {
	var activity = $.extend(win.App.activity || {}, {
		init: function(param) {
			var $activity = $('#activity');
			// 添加汽车信息
			$activity.on('click', '>div.info', function() {
				location.hash = "#headerTitle/titleCarInfo#carInfo/1/0";
			});
		}
	});
	win.App.activity = activity;
}(window, jQuery));