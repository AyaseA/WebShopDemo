$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#payCenter_payCenter'),
    	pageStr = 'payCenter_payCenter',
    	headerHeight = $page.find('>div.header').height();

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
	$page.on('click', '>div.header >a.goBack', function(e) {
		e.stopPropagation();
		$page.find('div.confirm').show();
	});
	$page.on('click', 'div.confirm, div.confirm button.cancel', function() {
		$page.find('div.confirm').hide();
	});
	$page.on('click', 'div.confirm >div', function(e) {
		e.stopPropagation();
	});
	$page.on('click', '>div.confirm >button.confirm', function() {
		$$.redirect();
	});
});