$(function(){
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#index_index').height(bodyHeight),
        pageStr = 'index_index',
        headerHeight = $page.find('>div.header').height(),
        footerHeight = $page.find('>div.footer').height();

    // 设置主窗口高度和位置
    resetWindowSize();
    // 窗口尺寸变化重新计算窗口高度和位置
    window.onresize = function() {
        bodyHeight = window.innerHeight || document.body.clientHeight;
        headerHeight = $page.find('>div.header').height();
        footerHeight = $page.find('>div.footer').height();
        resetWindowSize();
    };

    // 主页模块快捷入口按钮点击事件（洗车、做保养、邀请有礼）
    $page.find('div.entrance >div').on('click', function() {
        var type = $(this).attr('data-type');
        switch(type) {
            case 'carWash': {
                // 一元洗车
                $$.redirect();
            } break;
            case 'maintain': {
                // 车辆信息
                $$.redirect();
            } break;
            case 'friendAdd': {
                // 邀请有礼
                $$.redirect();
            } break;
        }
    });
    // 活动点击事件
    $page.find('div.activity').on('click', function() {
        
    });

    // 重设窗口高度
    function resetWindowSize() {
        $page.find('>div.main').css({
            'height': bodyHeight - headerHeight - footerHeight + 'px',
            'top': headerHeight + 'px'
        });
    }
    


    /*
        选择器要加上 #文件夹名_文件名
        例：$('#index_index button.button')

        所有事件绑定到 $('#文件夹名_文件名')下
        例子如下
        $('#test_test').on('click', 'button.button', function() {
            
        });
    */
    
    /*var data = {
        title: '标签',
        list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
    };
    // 模版id 文件夹名_文件名_自定义名
    var html = template(pageStr + '_list', data);
    $page.find('.list').html(html);*/
});