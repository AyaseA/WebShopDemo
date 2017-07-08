$(function() {
    var $page = $('#home_invite'),
        pageStr = 'home_invite',
        bodyHeight = window.innerHeight || document.body.clientHeight,
        headerHeight = $page.find('div.header').height();
    
    // 如果登录执行事件绑定、信息获取等
    if ($$.isLogin(true)) {
        // 获取Token
        var token = $$.getToken(),
            registerCont = $$.getUserInfo().InviteCode;
        // 设置高度
        $page.find('div.main').css({
            'height': bodyHeight - headerHeight
        });
        // 设置返回按钮可用
        $$.setGoBack($page.find('a.goBack'));
        
        $$.loadJavascript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js');
        // 分享链接http://127.0.0.1:8080/theme/default/?__RDTURL__=showShare/showShare.html
        var shareLink = location.href.split('?')[0] +
            "?__RDTURL__=wechatLogin/wechatLogin.html&RegisterFrom=1&RegisterCont=" +
            registerCont;

        // 分享标题
        var shareTitle = "测试";
        // 分享图标
        var shareImage = "";
        // 分享描述
        var shareDesc = "测试测试测试测试测试测试测试测试测试测试测试测试测试测试";

        var shareObj = {
            shareLink: shareLink,
            shareTitle: shareTitle,
            shareImage: shareImage,
            shareDesc: shareDesc
        };

        // 分享图标点击事件
        $page.on('click', 'div.entry', function() {
            inviteEntry($(this).attr('data-type'), shareObj);
        });
    }
    // 分享入口
    function inviteEntry(type, shareObj) {
        switch (type) {
            case 'wechat': {
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: shareObj.shareTitle, // 分享标题
                    desc: shareObj.shareDesc, // 分享描述
                    link: shareObj.shareLink, // 分享链接
                    imgUrl: shareObj.shareImage, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            } break;
            case 'friendscircle': {
                // 获取"分享"到朋友圈按钮点击状态及自定义分享内容接口
                wx.onMenuShareTimeline({
                    title: shareObj.shareTitle, // 分享标题
                    link: shareObj.shareLink, // 分享链接
                    imgUrl: shareObj.shareImage, // 分享图标
                    desc: shareObj.shareDesc, // 分享描述
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            } break;
            case 'qrcode': {
                showModal();
                createQRCode(shareObj.shareLink);
            } break;
            case 'qq': {
                // 获取“分享到QQ”按钮点击状态及自定义分享内容接口*
                wx.onMenuShareQQ({
                    title: shareObj.shareTitle, // 分享标题
                    desc: shareObj.shareDesc, // 分享描述
                    link: shareObj.shareLink, // 分享链接
                    imgUrl: shareObj.shareImage, // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            } break;
            case 'qqzone': {
                // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                wx.onMenuShareQZone({
                    title: shareObj.shareTitle, // 分享标题
                    desc: shareObj.shareDesc, // 分享描述
                    link: shareObj.shareLink, // 分享链接
                    imgUrl: shareObj.shareImage, // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            } break;
        }
    }
    // 显示弹框
    function showModal() {
        layer.open({
            type: 1,
            title: false, //不显示标题栏
            closeBtn: true,
            area: ['210px', '240px'],
            shade: 0.5,
            moveType: 1, //拖拽模式，0或者1
            content: template(pageStr + '_qrcode_tpl', {})
        });
    }
    // 根据url创建二维码
    function createQRCode(url) {
        url = $.trim(url);
        if (url) {
            new QRCode($('#home_invite_qrcode >div')[0], {
                width: 190,
                height: 190
            }).makeCode(url);
        }
    }
});
