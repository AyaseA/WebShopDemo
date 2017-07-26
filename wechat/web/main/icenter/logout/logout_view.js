!(function() {
    var url = $$.config.serverAddr,
        isLogout = true;
    if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
        isLogout = false;
        $('.logout_but').text('解除绑定');
    } else if (navigator.userAgent.indexOf('csl-ios') != -1) {
        isLogout = true;
        $('.logout_but').text('退出登录');
    } else if (navigator.userAgent.indexOf('csl-android') != -1) {
        isLogout = true;
        $('.logout_but').text('退出登录');
    }
    $('.logout_back').click(function() {
    	$$.goBack();
    });
    $('.photo_updata').click(function() {
    	layer.msg('已是最新版本！');
    });
    $('.logout_but').off('click').on('click', function() {
        layer.confirm(isLogout ? '确认退出登录？' : '确认解除绑定？', { icon: 3, title: '提示' }, function(index) {
            if (isLogout) {
                layer.msg('您已退出登录！');
                $$.delUserCookies();
                location.href = 'http://api.cheshili.com.cn/wechat/www/web/main/index.html?R=home%2Findex.html';
            } else {
                layer.msg('您已解除绑定！');
                $$.delUserCookies();
                location.href = 'http://api.cheshili.com.cn/CSL/Login/HandleMenu?url%3Dhome/index.html%26state%3D1'
            }
            layer.close(index);
        });
    });
}());