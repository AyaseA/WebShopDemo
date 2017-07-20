!(function(){
	$('.remBling_back').on('click', function() {
		$$.goBack();
	});
	$('.reBl_goto_index').on('click', function() {
		$$.redirect('home/index.html');
	});
	$('.reBl_goto_bling').on('click', function() {
		$$.redirect('home/wechatLogin.html');
	});
}());
