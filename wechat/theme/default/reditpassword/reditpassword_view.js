!(function(){
	$('.return_button_red').on('click', function(){
		$$.goBack();
	});
	//监听清除的display
	$('#login_input_1').on('click', function() {
	    $('#round_clear_1').css('display', 'block');
	});
	$('#login_input_2').on('click', function() {
	    $('#round_clear_2').css('display', 'block');
	});
	$('#login_input_3').on('click', function() {
	    $('#round_clear_3').css('display', 'block');
	});
	$('#login_input_5').on('click', function() {
	    $('#round_clear_5').css('display', 'block');
	});
	//监听数据清除
	$('#round_clear_1').on('click', function() {
	    $('#login_input_1').val('');
	    $('#round_clear_1').toggle();
	});
	$('#round_clear_2').on('click', function() {
	    $('#login_input_2').val('');
	    $('#round_clear_2').toggle();
	});
	$('#round_clear_3').on('click', function() {
	    $('#login_input_3').val('');
	    $('#round_clear_3').toggle();
	});
	$('#round_clear_5').on('click', function() {
	    $('#login_input_5').val('');
	    $('#round_clear_5').toggle();
	});
}());


 