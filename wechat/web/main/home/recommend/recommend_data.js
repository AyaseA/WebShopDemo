$(function () {
    var $page = $('#home_recommend'),
        pageStr = 'home_recommend';

    if ($$.isLogin(true)) {
        var qrCode = $$.getCookie('__RECOMMENDQR__'),
            mobile = $$.getUserMobile(),
            registerCont = $$.getUserInfo().InviteCode,
            shareLink = location.href.split('?')[0] + '?R=' +
                escape('home/wechatLogin.html?RegisterFrom=1&RegisterCont=' + registerCont);
        $page.find('>div.main >div.content >span').text(mobile);
        $('#home_recommend_qrcode').empty();
        new QRCode($('#home_recommend_qrcode')[0], {
            width: 224,
            height: 224
        }).makeCode(shareLink);
    }
});