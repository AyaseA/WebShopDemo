!(function(){
	if ($$.getToken()) {
		var token = $$.getToken();
		var url = $$.config.serverAddr;
		$$.post(url+'/CSL/Account/QueryAccountCount', {}, function(data) {
					data.Data == 'Not login!' ? 0 : data.Data; 
					$('.bin_balance').html(data.Data);
					console.log(data.Data);
		});
	}
}());
