$(function() {
	var $page = $('#payCenter_payCenter'),
    	pageStr = 'payCenter_payCenter';

	// 默认
	$page.on('click', 'div.payMode >div', function() {
		var $this = $(this);
        if ($this.hasClass('selected')) {
            return false;
        }
        $this.addClass('selected');
        $this.siblings().removeClass('selected');
	});
	// 设置返回按钮
	$$.setGoBack($page.find('>div.header >a.goBack'));
});