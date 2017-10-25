/**
 * Created by tianw on 2017/10/24.
 */
$(function() {
    var $page = $('#activity_fightReq'),
        pageStr = 'activity_fightReq',
        w = $page.width();
    $('.main>.fight>.btn').click(function() {
        layer.open({
            title: "<img src='images/fightReq/qr_code.png' style='width: 6vw;position: absolute;top: 2.8vw;'><span style='margin-left: 8vw;color:#f60'>关注车势力</span>",
            content: "<p style='text-align:center;font-size:3.3vw;color:#8e8c8c;margin-bottom: 2vw;'>长按并识别图中二维码。关注车势力</p><p style='margin-top:2vw'><img style='width:70vw;' src='images/fightReq/guanzhu.jpg' alt=''><p style='margin-top:2vw text-align: center'><img src='images/fightReq/logo.png' style='width:25vw;'></p>",
            area: ["80vw", "115vw"],
            btn: [],
            cancel: function () {
                clearInterval(time);
            }

        })
    })

    // if ($$.isLogin(true)) {
        var qrCode = $$.getCookie('__RECOMMENDQR__'),
            mobile = $$.getUserMobile(),
            registerCont = $$.getUserInfo().InviteCode,
            shareLink = location.href.split('?')[0] + '?R=' +
                escape('home/wechatLogin.html?RegisterFrom=1&RegisterCont=' + registerCont);
        $page.find('>div.main >div.content >span').text(mobile);
        $('#activity_fightReq_qrcode').empty();
        new QRCode($('#activity_fightReq_qrcode')[0], {
            width: w * 0.681,
            height: w * 0.681
        }).makeCode(shareLink);
    // }

    //配置微信

    /*var WXsign = $$.getWeChatSign(1);
     wx.config({
     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
     appId: $$.config.wxAppID, // 必填，公众号的唯一标识
     timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
     nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
     signature: WXsign.sign, // 必填，签名，见附录1
     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
     });
     //通过ready接口处理成功验证
     wx.ready(function() {});

     wx.error(function() {});

     if ($$.isLogin(true)) {
     $page.find(".share").click(function() {
     var registerCont = $$.getUserInfo().InviteCode;
     if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
     wx.onMenuShareTimeline({
     title: '车势力推荐注册有礼', // 分享标题
     link:$$.config.hostAddr+ "wechat/www/web/main/index.html?R=" + escape("icenter/codeRegister.html?RegisterFrom=1&RegisterCont=" + registerCont), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
     imgUrl: $$.config.hostAddr + 'wechat/www/web/main/images/icon.png', // 分享图标
     success: function() {
     // 用户确认分享后执行的回调函数
     },
     cancel: function() {
     // 用户取消分享后执行的回调函数
     }
     });

     wx.onMenuShareAppMessage({
     title: '车势力推荐注册有礼', // 分享标题
     desc: '扫码注册车势利，钜惠豪礼抢不停', // 分享描述
     link: $$.config.hostAddr + "wechat/www/web/main/index.html?R=" + escape("icenter/codeRegister.html?RegisterFrom=1&RegisterCont=" + registerCont), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
     imgUrl: $$.config.hostAddr + 'wechat/www/web/main/images/icon.png', // 分享图标
     type: '', // 分享类型,music、video或link，不填默认为link
     dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
     success: function() {
     // 用户确认分享后执行的回调函数
     },
     cancel: function() {
     // 用户取消分享后执行的回调函数
     }
     });


     var mirror = "<div class='mirror'><img src='images/recommend/arrow.png'><p>点击右上角<span>三个点</span>推荐注册有大礼哦~</p></div>";
     $page.append(mirror);

     setTimeout(function() {
     $(".mirror").remove();
     }, 8000);
     } else if (navigator.userAgent.indexOf('csl-ios') != -1) {
     wx.onMenuShowShareView({
     title: '车势力推荐注册有礼', // 分享标题
     link: $$.config.hostAddr + "wechat/www/web/main/index.html?R=" + escape("icenter/codeRegister.html?RegisterFrom=1&RegisterCont=" + registerCont), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
     imgUrl: $$.config.hostAddr + 'wechat/www/web/main/images/icon.png', // 分享图标
     desc: '扫码注册车势利，钜惠豪礼抢不停！', // 分享描述
     success: function() {
     // 用户确认分享后执行的回调函数
     },
     cancel: function() {
     // 用户取消分享后执行的回调函数
     }
     });

     } else if (navigator.userAgent.indexOf('csl-android') != -1) {
     wx.onMenuShowShareView({
     title: '车势力推荐注册有礼', // 分享标题
     link: $$.config.hostAddr + "wechat/www/web/main/index.html?R=" + escape("icenter/codeRegister.html?RegisterFrom=1&RegisterCont=" + registerCont), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
     imgUrl: $$.config.hostAddr + 'wechat/www/web/main/images/icon.png', // 分享图标
     desc: '扫码注册车势利，钜惠豪礼抢不停！', // 分享描述
     success: function() {
     // 用户确认分享后执行的回调函数
     },
     cancel: function() {
     // 用户取消分享后执行的回调函数
     }
     });
     }
     });
     }*/
});