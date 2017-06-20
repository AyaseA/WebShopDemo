
!(function(){
	$('.logout_but').on('click', function(){
		$('.logout_but_out').css('display', 'block');
		$('.logout_but_words').css('display', 'block')
		$('.logout_prot_tips').css('display', 'block');
		$('.logout_right').css('display', 'block');
		$('.logout_wrong').css('display', 'block');
	});
	$('.logout_right').on('click', function(){
		$$.redirect('login/login.html');
		$$.delCookie('__TOKEN__');
		$('.logout_but_out').css('display', 'none');
		$('.logout_but_words').css('display', 'none')
		$('.logout_prot_tips').css('display', 'none');
		$('.logout_right').css('display', 'none');
		$('.logout_wrong').css('display', 'none');		
	});
	$('.logout_wrong').on('click', function(){
		$('.logout_but_out').css('display', 'none');
		$('.logout_but_words').css('display', 'none')
		$('.logout_prot_tips').css('display', 'none');
		$('.logout_right').css('display', 'none');
		$('.logout_wrong').css('display', 'none');		
	});
	$('.redit_password').on('click', function(){
		/*$$.redirect('reditpassword/reditpassword.html');*/
	});
	$('.logout_back').on('click', function(){
		$$.redirect('pageHome/pageHome.html', {
                    'fromGoBack': true
        });
	});	
}());
