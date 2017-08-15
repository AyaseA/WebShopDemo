$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#home_payCenter'),
    	pageStr = 'home_payCenter';

    if ($$.config.isCompatibleIOSTop && navigator.userAgent.indexOf('csl-ios') != -1) {
        $page.find('>div.main').css({
            'top': '64px'
        }).end().find('>div.header').height(64);
    }

    var headerHeight = $page.find('>div.header').height();
    $page.find('>div.main').height(bodyHeight - headerHeight);

    // 默认
	$page.on('click', 'div.payMode >div', function() {
		var $this = $(this);
        if ($this.hasClass('selected')) {
            return false;
        }
        $this.addClass('selected');
        $this.siblings().removeClass('selected');
	});
	$page.on('click', '>div.header >a.goBack', function() {
		if ($page.find('div.confirm').is(':visible')) {
			return false;
		}
		$page.find('div.confirm').show();
		$page.find('div.confirm').find('p').text('订单还未支付，确认退出？');
	});
	$page.on('click', 'div.confirm, div.confirm button.cancel', function() {
		$page.find('div.confirm').hide();
	});
	$page.on('click', 'div.confirm >div', function(e) {
		e.stopPropagation();
	});
	$page.on('click', 'div.confirm button.confirm', function() {
		$$.goBack();
	});
});