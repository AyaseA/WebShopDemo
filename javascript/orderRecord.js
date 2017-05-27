!(function(win, $, undefined) {
	var orderRecord = $.extend(win.App.orderRecord || {}, {
		init: function() {
			var $orderRecord = $('#orderRecord');
			// 点击tab页
			$orderRecord.find('>ul >li').click(function() {
				var $this = $(this);
				if ($this.hasClass('active')) {
					return false;
				}
				$this.addClass('active').siblings().removeClass('active');
				console.log($this.attr('data-tab'));
			});
		}
	});
	win.App.orderRecord = orderRecord;
}(window, jQuery));