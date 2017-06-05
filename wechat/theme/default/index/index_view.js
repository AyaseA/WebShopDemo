$(function(){
    /*
        选择器要加上 #文件夹名_文件名
        例：$('#index_index button.button')

        所有事件绑定到 $('#文件夹名_文件名')下
        例子如下
        $('#test_test').on('click', 'button.button', function() {
            
        });
    */
    
    var data = {
        title: '标签',
        list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
    };
    // 模版id 文件夹名_文件名_自定义名
    var html = template('index_index_list', data);
    $('#index_index .list').html(html);
});