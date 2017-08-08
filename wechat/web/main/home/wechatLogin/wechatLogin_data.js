$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#home_wechatLogin'),
    	pageStr = 'home_wechatLogin',
        redirectUrl = unescape($$.getQueryString('redirecturl'));

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
                if (redirectUrl) {
                    if (redirectUrl.indexOf('?')) {
                        redirectUrl += '&code=' + code + '&str' + str
                    } else {
                        redirectUrl += '?code=' + code + '&str' + str
                    }
                    $$.redirect(redirectUrl);
                } else {
                    $$.redirect('home/index.html?code=' + code + '&str' + str);
                }
            }
        }
    }
});
