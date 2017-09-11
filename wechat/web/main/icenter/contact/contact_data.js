$(function () {
    var $page = $('#icenter_contact'),
        pageStr = 'icenter_contact',
        callCode = $$.getQueryString('CallCode'),
        token = $$.getCookie('__TOKEN__');
    
    $page.find('>div.main').show();
    $page.find('>div.check').hide();

    $.ajax({
        url: $$.config.serverAddr + 'CSL/User/TestToken',
        type: 'POST',
        data: {
            WToken: token
        },
        dataType: 'json',
        success: function(res) {
            if (res.Status == 100) {
                $.ajax({
                    url: $$.config.serverAddr + 'CSL/P_Msg/TriCall',
                    type: 'POST',
                    data: {
                        WToken: token,
                        CallCode: callCode
                    },
                    dataType: 'json',
                    success: function(res) {
                        if (res.Status == 0) {
                            $page.find('>div.main').show();
                            $page.find('>div.check').hide();
                        } else if (res.Status == 95) {
                            layer.msg('该二维码未绑定用户');
                            $$.goBack();
                        } else if (res.Status == 96) {
                            $page.find('>div.main').hide();
                            $page.find('>div.check').show();
                        } else if (res.Status == 97) {
                            layer.msg('不能给自己打电话');
                            $$.goBack();
                        } else if (res.Status == 98) {
                            layer.msg('二维码不可用');
                            $$.goBack();
                        } else if (res.Status == 99) {
                            layer.msg('拨打的号码不存在');
                            $$.goBack();
                        } else if (res.Status == 999) {
                            layer.msg('未知错误');
                            $$.goBack();
                        }
                    }
                });
            } else if (res.Status == -1) {
                var fullUrl = location.href;
                    fullUrl = fullUrl.indexOf('?') != -1 ? fullUrl.split('?')[0] + '?R=' : fullUrl + '?R=',
                    page = fullUrl + escape($$.getUrl()),
                    prevPage = fullUrl + escape($$.stack.getLast() || 'home/index.html');
                if (navigator.userAgent.indexOf('csl-ios') != -1) {
                    wx.showLoginPage({
                        'page': page,
                        'prevPage': prevPage,
                        'noConfirm': true
                    });
                } else if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
                    $$.redirect('home/wechatLogin.html');
                } else if (navigator.userAgent.indexOf('csl-android') != -1) {
                    wx.showLoginPage({
                        'page': page,
                        'prevPage': prevPage
                    });
                } else {
                    $$.redirect('icenter/login.html');
                }
            }
        }
    });

    $page.off('click dbclick', '>div.check >p >span, >div.check >a')
         .on('click dbclick', '>div.check >p >span, >div.check >a', function() {
        $$.redirect('home/fillOrder.html?pid=48&type=0&callcode=' + callCode);
    });

    $$.config.hideGlobalMenu();
    
    $page.find('div.warp').html(template(pageStr + '_content', {
        type: 'msg',
        callCode: callCode
    }));
});