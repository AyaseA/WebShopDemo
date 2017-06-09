$(function() {
	var $page = $('#carInfo_carInfo'),
    	pageStr = 'carInfo_carInfo';

    $page.find('div.main').css({
    	'margin-top': $page.find('div.header').height()
    });
    $$.setGoBack($page.find('>div.header >a.goBack'));
    // 选择日期
    (new datePicker()).init({
        /* 按钮选择器，用于触发弹出插件 */
        'trigger': '#carInfo_carInfo div.carDetail input[name=timeBuy]',
        /* 模式：date日期；datetime日期时间；time时间；ym年月；*/
        'type': 'date'
    });
    // 设置默认点击事件
    $page.on('click', 'div.carDetail div.setDefault', function() {
        var $this = $(this);
        if ($this.hasClass('default')) {
            $this.removeClass('default');
        } else {
            $this.addClass('default');
        }
    });

});