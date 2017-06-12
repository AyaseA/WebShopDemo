
$(function() {
    
    // $$.loadJavascript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js');

    var $page = $('#share_share');
    pageStr = 'share_share';



    var shareLink = "http://192.168.2.2:8080/theme/default/?__RDTURL__=showShare/showShare.html"; // 分享链接http://127.0.0.1:8080/theme/default/?__RDTURL__=showShare/showShare.html
    var shareTitle = "测试"; // 分享标题
    var shareImage = ""; // 分享图标
    var shareDesc = "测试测试测试测试测试测试测试测试测试测试测试测试测试测试"; // 分享描述

    // var tip = '1.点击分享按钮，分享给好友，即可获得车势力专属优惠。2.此活动最终解释权归车势力所有。';
    // $page.find('.sharetip').html(tip);

    // alert( $page.find('.sharetip'));
    /*
    	选择器要加上 #文件夹名_文件名
    	例：$('#文件夹名_文件名 button.button')

    	所有事件绑定到 $('#文件夹名_文件名')下
    	例子如下
    */


    $page.on('click', 'div.sharebtn', function() {


        //iframe窗
        var index = layer.open({
            type: 1,
            title: '',
            closeBtn: 0, //不显示关闭按钮
            shade: [0],
            skin: 'share-alert',
            area: ['90%', '240px'],
            offset: (window.screen.availHeight - 250) + 'px',
            // offset: 'auto', //右下角弹出
            // time: 2000, //2秒后自动关闭
            shadeClose: true,
            // shift: 2,
            anim: 2,
            isOutAnim: 0,
            success: function(layero) {

                $(".share-cancle").on('click', function() {
                    layer.close(index);
                });
                $(".share-btn").on('click', function() {
                    inviteEntry($(this).attr('data-type'));
                });


            },
            
            content: template(pageStr + '_alert', {}), //iframe的url，no代表不显示滚动条


        });

    });
    // 分享入口
    function inviteEntry(type) {
        switch (type) {
            case 'wechat':
                {
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
                }
                break;
            case 'qqzone':
                {
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
                }
                break;
        }
    }
    $$.setGoBack($page.find('a.goBack'));

});
