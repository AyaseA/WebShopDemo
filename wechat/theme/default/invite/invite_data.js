$(function() {


    

    var weChatSign = $$.getWeChatSign();

    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx2c53034422e377cc', // 必填，公众号的唯一标识
        timestamp: weChatSign.timestamp, // 必填，生成签名的时间戳
        nonceStr: weChatSign.noncestr, // 必填，生成签名的随机串
        signature: weChatSign.sign, // 必填，签名，见附录1
        jsApiList: ['getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone']
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });


    // -- 4. 通过ready接口处理成功验证
    wx.ready(function() {
        alert("微信配置成功");
        var shareLink = 'https://www.cheshili.cn/WeChat/theme/lc/index.html?__RDTURL__=showShare/showShare.html';
        var shareTitle = "测试"; // 分享标题
        var shareImage = "https://www.cheshili.cn/WeChat/theme/lc/shareicon.png"; // 分享图标
        var shareDesc = "测试测试测试测试测试测试测试测试测试测试测试测试测试测试"; // 分享描述
        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: shareImage, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
                alert('// 用户确认分享后执行的回调函数');
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
                alert('// 用户取消分享后执行的回调函数');
            }
        });
        // 获取"分享"到朋友圈按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: shareTitle, // 分享标题
            link: shareLink, // 分享链接
            imgUrl: shareImage, // 分享图标
            desc: shareDesc, // 分享描述
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        // 获取“分享到QQ”按钮点击状态及自定义分享内容接口*
        wx.onMenuShareQQ({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: shareImage, // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
        wx.onMenuShareQZone({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareLink, // 分享链接
            imgUrl: shareImage, // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    });


});
