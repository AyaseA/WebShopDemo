!(function(){
	
	var $page = $('#pageHome_pageHome'),
        pageStr = 'pageHome_pageHome';

	// footer 事件
    $page.on('click', 'div.footer li', function() {
        var type = $(this).attr('data-tab');
        switch(type) {
            case 'index': {
                // 首页
                $$.redirect('index/index.html');
            } break;
            case 'luckyDraw': {
                // 幸运抽奖
                $$.redirect('luckyDraw/luckyDraw.html');
            } break;
            case 'center': {
                // 个人中心
                $$.redirect('pageHome/pageHome.html');
            } break;
        }
    });
   //商品列表
    $('#article_con_tent').on('click', function(){
        $$.redirect('orderList/orderList.html');
    });   
    //设置
    $('#login_set_out').on('click', function(){
        $$.redirect('logout/logout.html');
    });


}());


 