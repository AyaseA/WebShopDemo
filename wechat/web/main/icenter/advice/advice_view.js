!(function(){
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
	$('.advice_back').on('click', function(){
		$$.goBack();
	});
}());
