!(function() {
    var url = $$.config.serverAddr,
        isLogout = true,
        token=$$.getToken();
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
        if (navigator.userAgent.indexOf('csl-ios') != -1 || navigator.userAgent.indexOf('csl-android') != -1) {
            wx.updateVersion({
                data:true
            });
        } else {
            layer.msg("已经是最新版本了");
        }
    });
    //清空缓存
    $('.clearCache').click(function(){
        $.ajax({
            type: "POST",
            data:{
                WToken: token
            },
            url: url+"CSL/User/FlushRedisByUserID",
            success: function(res) {
                var txt = JSON.parse(res);
                if(txt.Status == 0){
                    layer.msg("已清空缓存");
                }
            }
        })
    });
    $('.logout_but').off('click').on('click', function() {
        layer.confirm(isLogout ? '确认退出登录？' : '确认解除绑定？', { icon: 3, title: '提示' }, function(index) {
            if (isLogout) {
                layer.msg('您已退出登录！');
                $$.delUserCookies();
                if(navigator.userAgent.indexOf('csl-android') != -1){
                    wx.exit({
                        data:"ture"
                    });
                }
                location.href = $$.config.serverAddr + 'wechat/www/web/main/index.html?R=home%2Findex.html';
            } else {
                layer.msg('您已解除绑定！');
                $$.delUserCookies();
                location.href = $$.config.serverAddr + 'CSL/Login/HandleMenu?url%3Dhome/index.html%26state%3D1'
            }
            layer.close(index);
        });
    });
}());