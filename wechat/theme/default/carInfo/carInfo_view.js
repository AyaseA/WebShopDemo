$(function() {
	var $page = $('#carInfo_carInfo'),
    	pageStr = 'carInfo_carInfo';

    $page.find('div.main').css({
    	'margin-top': $page.find('div.header').height()
    });

    $$.setGoBack($page.find('>div.header >a.goBack'));
});