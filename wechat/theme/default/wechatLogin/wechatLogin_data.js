$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
    	$page = $('#wechatLogin_wechatLogin'),
    	pageStr = 'wechatLogin_wechatLogin',
        url = location.href;
    // 设置禁用
    $$.config.hideGlobalMenu();
    $page.find('>div.clause').css({
        'top': bodyHeight,
        'display': 'none'
    });
    // 判断是否已经授权
    isAuth();
    function isAuth() {
        if (url.indexOf('?R=') != -1) {
            url = unescape(url.split('?')[1]);
        }
        var code = $$.getQueryString('code', url),
            str = $$.getQueryString('str', url);
        if (code == '0') {
            // 保存token
            if (str.length == 32) {
                // 已授权，跳转到首页
                $$.redirect('index/index.html?code=' + code + '&str' + str);
            }
        }
    }
});
