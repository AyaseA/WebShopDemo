!(function(){
	var $page = $('#icenter_advice'),
        pageStr = 'icenter_advice';
        
	$$.setGoBack($page.find('>div.header >a.goBack'));

	$page.on('click', '.advice_contact', function() {
        $page.find('div.confirm').show();
    });
    $page.on('click', 'div.confirm, div.confirm button.cancel', function() {
        $page.find('div.confirm').hide();
    });
    $page.on('click', 'div.confirm >div', function(e) {
        e.stopPropagation();
    });
}());
