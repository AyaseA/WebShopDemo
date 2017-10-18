$(function() {
    var $page = $('#icenter_orderList'),
        pageStr = 'icenter_orderList';
        
	$page.find('div.header >a').click(function(){
		$$.redirect("icenter/pageHome.html");
		sessionStorage.setItem("pageTab","");//ÐÞ¸Ä
	});
});