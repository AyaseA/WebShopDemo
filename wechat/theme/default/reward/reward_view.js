!(function(){
	$('.reward_back').on('click', function(){
		$$.goBack();
	});
	if ($$.getToken()) {
		var token = $$.getToken();
		var url = 'http://192.168.1.110:8000';
		$$.post(url+'/CSL/Reward/QueryRewardCount', {}, function(data) {
			console.log(data.Data);
			data.Data == 'Not login!' ? 0 : data.Data; 
			$('.reword_balance').html(data.Data);
		});
	}
}());
