$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#activity_activity'),
    	pageStr = 'activity_activity',
    	headerHeight = $page.find('>div.header').height();

    $page.find('div.main').css({
        'height': bodyHeight - headerHeight + 'px',
        'margin-top': headerHeight + 'px'
    });

    $$.setGoBack($page.find('a.goBack'));

    $page.on('click', 'div.main div.info', function() {
    	$$.redirect('myCars/myCars.html?' + $$.goBackUrl());
    });
});