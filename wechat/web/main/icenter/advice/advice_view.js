!(function(){
	var $page = $('#icenter_advice'),
        pageStr = 'icenter_advice';
	$('.advice_contact').on('click', function(){
		$('.advice_but_cont').css('display', 'block');
		$('.advice_but_words').css('display', 'block');
		$('.advice_prot_tips').css('display', 'block');
		$('.advice_right').css('display', 'block');
		$('.advice_wrong').css('display', 'block');
	});
	$('.advice_wrong').on('click', function(){
		$('.advice_but_cont').css('display', 'none');
		$('.advice_but_words').css('display', 'none');
		$('.advice_prot_tips').css('display', 'none');
		$('.advice_right').css('display', 'none');
		$('.advice_wrong').css('display', 'none');		
	});
	$('.advice_right').on('click', function(){
		$('.advice_but_cont').css('display', 'none');
		$('.advice_but_words').css('display', 'none');
		$('.advice_prot_tips').css('display', 'none');
		$('.advice_right').css('display', 'none');
		$('.advice_wrong').css('display', 'none');		
	});
	$$.setGoBack($page.find('>div.header >a.goBack'));

	$page.on('click', 'button.advice_button', function() {
		layer.msg('感谢您的意见与建议，我们将努力改进~');
		$page.find('textarea').val('');
	});

	$page.on('click', '.advice_contact', function() {
        $page.find('div.confirm').show();
    });
    $page.on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    $page.on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });
}());
