!(function(){
	if ($$.getToken()) {
		var token = $$.getToken();
		var url = $$.config.serverAddr;
		$$.post(url+'/CSL/Reward/QueryRewardCount', {}, function(data) {
			console.log(data.Data);
			data.Data == 'Not login!' ? 0 : data.Data; 
			$('.reword_balance').html(data.Data);
		});
	}
}());


