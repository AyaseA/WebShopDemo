$(function() {
    var $page = $('#icenter_orderList'),
        pageStr = 'icenter_orderList';
        
	$page.find('div.header >a').click(function(){
		$$.goBack();
		sessionStorage.setItem("pageTab","");
	});
});