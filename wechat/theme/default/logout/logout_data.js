
var url = $$.config.serverAddr;
$('.logout_right').on('click', function(){
	$$.post(url+'/CSL/User/Exit', {}, function(data) {
		$$.delCookie('__TOKEN__');
	});
});
