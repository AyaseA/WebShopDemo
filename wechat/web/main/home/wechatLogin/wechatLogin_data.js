$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#home_wechatLogin'),
    	pageStr = 'home_wechatLogin';

    // 设置禁用悬浮菜单
    $$.config.hideGlobalMenu();

    $page.find('>div.clause').css({
        'top': bodyHeight,
        'display': 'none'
    });
    // 判断是否已经授权
    isAuth();
    function isAuth() {
        var code = $$.getQueryString('code'),
            str = $$.getQueryString('str');
        if (code == '0') {
            // 保存token
            if (str.length == 32) {
                // 已授权，跳转到首页
                layer.msg('账户已关联，跳转首页！');
                $$.redirect('index/index.html?code=' + code + '&str' + str);
            }
        }
    }
});
