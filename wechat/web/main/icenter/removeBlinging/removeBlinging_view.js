!(function(){
	$('.remBling_back').on('click', function() {
		$$.goBack();
	});
	$('.reBl_goto_index').on('click', function() {
		$$.redirect('index/index.html');
	});
	$('.reBl_goto_bling').on('click', function() {
		$$.redirect('wechatLogin/wechatLogin.html');
	});
}());
