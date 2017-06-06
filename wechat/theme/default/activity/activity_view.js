$(function() {
	var $page = $('#activity_activity'),
    	pageStr = 'activity_activity',
    	headerHeight = $page.find('>div.header').height();

    $page.find('>div.stance').height(headerHeight);

    $$.setGoBack($page.find('a.goBack'));
});