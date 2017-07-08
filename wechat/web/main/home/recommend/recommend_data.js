$(function () {
    var $page = $('#home_recommend'),
        pageStr = 'home_recommend';
    // 设置禁用悬浮菜单
    $$.config.hideGlobalMenu();
    //$$.delCookie('__RECOMMENDQR__')
    if (!$$.isLogin()) {
        $$.redirect('home/wechatLogin.html');
    } else {
        var qrCode = $$.getCookie('__RECOMMENDQR__'),
            mobile = $$.getUserMobile();
        $page.find('>div.main >div.content >span').text(mobile);
        if (qrCode) {
            $page.find('>div.main >div.content >img').attr(
                'src', qrCode || $$.config.serverAddr + 'Img/NoImg/' + Math.random() + '.jpg'
            );
        } else {
            $$.post(
                'CSL/W_Msg/PostInfoByToken',
                {
                    WToken: $$.getToken(),
                    Url: escape('https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token={ACCESS_TOKEN}'),
                    JsonStr: JSON.stringify({
                        expire_seconds: 2592000,
                        action_name: 'QR_SCENE',
                        action_info: {
                            scene: {
                                scene_id: $$.getUserId()
                            }
                        }
                    })
                },
                function(res) {
                    if (res.Status == 0 && res.Data) {
                        var recommendImg = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.Data.ticket;
                        $$.setCookie('__RECOMMENDQR__', recommendImg, 25);
                        $page.find('>div.main >div.content >img').attr(
                            'src', recommendImg || $$.config.serverAddr + 'Img/NoImg/' + Math.random() + '.jpg'
                        );
                    }
                }
            );
        }
    }
});