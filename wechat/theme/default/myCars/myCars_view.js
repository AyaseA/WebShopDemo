$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#myCars_myCars'),
    	pageStr = 'myCars_myCars',
    	headerHeight = $page.find('div.header').height();

    $page.find('div.main').css({
    	'height': bodyHeight - headerHeight,
    	'margin-top': headerHeight
    });

    $$.setGoBack($page.find('a.goBack'));

    $page.find('a.addNew').attr('href', 'carInfo/carInfo.html?' + $$.goBackUrl());
});