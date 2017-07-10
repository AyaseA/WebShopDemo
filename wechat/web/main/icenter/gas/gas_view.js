!(function(){
	console.log($$.stack.pop());
	$('.gas_back').on('click', function(){
		$$.redirect('icenter/gascard.html');
	});
	$('.gas_to_card').on('click', function(){
		$$.redirect('icenter/gascard.html');
	});
}());
