$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#invite_invite'),
        pageStr = 'invite_invite',
        headerHeight = $page.find('div.header').height();
    
    $$.setGoBack($page.find('a.goBack')); 

    var shareLink = "http://www.baidu.com"; // 分享链接
    var shareTitle = ""; // 分享标题
    var shareImage = ""; // 分享图标
    var shareDesc = ""; // 分享描述

    $page.find('div.main').css({
        'height': bodyHeight - headerHeight,
        'top': headerHeight
    });

    $page.on('click', 'div.entry', function() {
        inviteEntry($(this).attr('data-type'));
    });
    
    // 分享入口
    function inviteEntry(type) {
        switch (type) {
            case 'wechat':
                {
                    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareAppMessage({
                        title: '', // 分享标题
                        desc: '', // 分享描述
                        link: '', // 分享链接
                        imgUrl: '', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                }
                break;
            case 'friendscircle':
                {
                    // 获取"分享"到朋友圈按钮点击状态及自定义分享内容接口
                    wx.onMenuShareTimeline({
                        title: 'wqwqw', // 分享标题
                        link: 'www.baidu.com', // 分享链接
                        imgUrl: '', // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                }
                break;
            case 'qrcode':
                {
                    showModal();
                    createQRCode('http://192.168.1.176:8080/#headerTitle/titleInvite#invite/1/0/');
                }
                break;
            case 'qq':
                {
                    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口*
                    wx.onMenuShareQQ({
                        title: '', // 分享标题
                        desc: '', // 分享描述
                        link: '', // 分享链接
                        imgUrl: '', // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                }
                break;
            case 'qqzone':
                {
                    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                    wx.onMenuShareQZone({
                        title: '', // 分享标题
                        desc: '', // 分享描述
                        link: '', // 分享链接
                        imgUrl: '', // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                }
                break;
        }
    }

    function showModal() {
        layer.open({
            type: 1,
            title: false, //不显示标题栏
            closeBtn: true,
            area: ['210px', '210px'],
            shade: 0.5,
            moveType: 1, //拖拽模式，0或者1
            content: '<div id="invite_invite_qrcode" style="padding: 10px 0 0 10px;"></div>'
        });
    }
    // 根据url创建二维码
    function createQRCode(url) {
        url = $.trim(url);
        if (url) {
            new QRCode($('#invite_invite_qrcode')[0], {
                width: 190,
                height: 190
            }).makeCode(url);
        }
    }
});
