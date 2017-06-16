$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#orderCommit_orderCommit'),
        pageStr = 'orderCommit_orderCommit',
        headerHeight = $page.find('>div.header').height();

    // 设置界面高度
    $page.find('>div.main').height(bodyHeight - headerHeight - 1);
    // 设置返回按钮可用
    $$.setGoBack($page.find('>div.header >a.goBack'));
    // 评价点星事件
    $page.on('click', '>div.main >div.stars >i', function() {
    	$(this).addClass('star');
    	$(this).prevAll().addClass('star');
    	$(this).nextAll().removeClass('star');
    });
    // 输入内容剩余字数统计
    $page.on('keyup', '>div.main >textarea', function() {
    	var maxTextNum = 500,
    		cnt = $(this).val();
    	if (cnt.length >= 500) {
    		$(this).val(cnt.substring(0, 500));
    		$page.find('>div.main >small').text(0);
    	} else {
    		$page.find('>div.main >small').text(500 - cnt.length);
    	}
    });
    // 匿名评价
    $page.on('click', '>div.main >div.anonymity >p', function() {
    	if ($(this).hasClass('selected')) {
    		$(this).removeClass('selected');
    	} else {
    		$(this).addClass('selected');
    	}
    });
});