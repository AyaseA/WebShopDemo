$(function() {
	var bodyHeight = window.innerHeight || document.body.clientHeight,
		$page = $('#icenter_info'),
    	pageStr = 'icenter_info',
    	headerHeight = $page.find('>div.header').height();
    // 设置高度
    $page.find('>div.main').height(bodyHeight - headerHeight);
    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));

    $page.on('click', 'div.header-icon', function() {
        $page.find('div.mask').fadeIn(200).find('>div').animate({
            'height': 160
        }, 200);
        $page.find('a.option1').text('拍照').attr('data-id', '1').attr('data-type', 'icon');
        $page.find('a.option2').text('相册').attr('data-id', '0').attr('data-type', 'icon');
    });
    
    $page.on('click', 'div.sex', function() {
        $page.find('div.mask').fadeIn(200).find('>div').animate({
            'height': 160
        }, 200);
        $page.find('a.option1').text('男').attr('data-id', '1').attr('data-type', 'sex');
        $page.find('a.option2').text('女').attr('data-id', '0').attr('data-type', 'sex');
    });

    $page.on('click', 'div.address', function() {
        $$.redirect('home/address.html');
    });

});