
!(function(){
	$('.logout_but').on('click', function(){
		$('.logout_but_out').css('display', 'block');
		$('.logout_but_words').css('display', 'block')
		$('.logout_prot_tips').css('display', 'block');
		$('.logout_right').css('display', 'block');
		$('.logout_wrong').css('display', 'block');
	});
	$('.logout_right').on('click', function(){
		$$.refresh('logout/logout.html',0);
		$('.logout_but_out').css('display', 'none');
		$('.logout_but_words').css('display', 'none')
		$('.logout_prot_tips').css('display', 'none');
		$('.logout_right').css('display', 'none');
		$('.logout_wrong').css('display', 'none');		
	});
	$('.logout_wrong').on('click', function(){
		/*$$.delCookie('__TOKEN__');*/
		$('.logout_but_words').css('display', 'none')
		$('.logout_prot_tips').css('display', 'none');
		$('.logout_right').css('display', 'none');
		$('.logout_wrong').css('display', 'none');	
		$('.logout_but_out').css('display', 'none');
		$$.delCookie('__TOKEN__');
        $$.delCookie('__UINFO__');
        $$.refresh('removeBlinging/removeBlinging.html',1);	
	});
	$('.redit_password').on('click', function(){
		/*$$.redirect('reditpassword/reditpassword.html');*/
	});
	$('.logout_back').on('click', function(){
		$$.redirect('icenter/pageHome.html', {
                    'fromGoBack': true
        });
	});	
}());
