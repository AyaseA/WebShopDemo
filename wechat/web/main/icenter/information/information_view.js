!(function() {
	if($$.getToken()) {
		$('.span_login_in').html($$.getUserMobile());
	}
	$('.head_photo_control').on('click', function() {
		$('.div_float_1').css('display', 'block');
		$('.photo_take').css('display', 'block');
		$('.photo_photogragh').css('display', 'block');
		$('.take_concel').css('display', 'block');
	});
	$('.take_concel').on('click', function() {
		$('.div_float_1').css('display', 'none');
		$('.photo_take').css('display', 'none');
		$('.photo_photogragh').css('display', 'none');
		$('.take_concel').css('display', 'none');		
	});
	$('.sex_message_control').on('click', function() {
		$('.div_float_1').css('display', 'block');
		$('.sex_male').css('display', 'block');
		$('.sex_female').css('display', 'block');
		$('.take_concel_2').css('display', 'block');
	});
	$('.take_concel_2').on('click', function() {
		$('.div_float_1').css('display', 'none');
		$('.sex_male').css('display', 'none');
		$('.sex_female').css('display', 'none');
		$('.take_concel_2').css('display', 'none');		
	});
	//性别
	$('.sex_male').on('click', function() {
		$('.span_text_value').html($.trim($(this).html()));
		$('.span_text_value').css('margin-left', '210px');
		$('.div_float_1').css('display', 'none');
		$('.sex_male').css('display', 'none');
		$('.sex_female').css('display', 'none');
		$('.take_concel_2').css('display', 'none');
	});
	$('.sex_female').on('click', function() {
		$('.span_text_value').html($.trim($(this).html()));
		$('.span_text_value').css('margin-left', '210px');
		$('.div_float_1').css('display', 'none');
		$('.sex_male').css('display', 'none');
		$('.sex_female').css('display', 'none');
		$('.take_concel_2').css('display', 'none');		
	});
	$('.information_back').on('click', function(){
		$$.goBack();
	});
	//拍照
	$('.photo_take').on('click', function() {
		$('.div_float_1').css('display', 'none');
		$('.photo_take').css('display', 'none');	
		$('.photo_photogragh').css('display', 'none');
		$('.take_concel').css('display', 'none');
	});
	$('.photo_photogragh').on('click', function() {
		$('.div_float_1').css('display', 'none');
		$('.photo_take').css('display', 'none');
		$('.photo_photogragh').css('display', 'none');
		$('.take_concel').css('display', 'none');		
	});
}());
