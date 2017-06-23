
var url = $$.config.serverAddr;
$('.logout_right').on('click', function(){
	$$.post(url+'/CSL/User/Exit', {}, function(data) {
		$$.delCookie('__TOKEN__');
		$$.delCookie('__LOCATION__');
		$$.delCookie('__URL__');
		$$.delCookie('__OLDDIV__');
		$$.delCookie('__NEWDIV__');
		$$.delCookie('__UINFO__');
	});
});

