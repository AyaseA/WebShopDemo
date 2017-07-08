!(function(){
	$('.gas_back').on('click', function(){
		$$.goBack();
	});
	$('.gas_to_card').on('click', function(){
		$$.redirect('gascard/gascard.html');
	});
}());
