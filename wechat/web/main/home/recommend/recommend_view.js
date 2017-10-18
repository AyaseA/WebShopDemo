$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#home_recommend'),
        pageStr = 'home_recommend',
        headerHeight = $page.find('>div.header').height(),
        w = $page.width();

    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - 1
    );

    // 返回按钮
    $$.setGoBack($page.find('>div.header >a.goBack'));

    window.recommend = {
        invite: function() {
            var WXsign = $$.getWeChatSign(1);
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: $$.config.wxAppID, // 必填，公众号的唯一标识
                timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
                nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
                signature: WXsign.sign, // 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            //通过ready接口处理成功验证
            wx.ready(function() {
                if ($$.isLogin(true)) {
                    var registerCont = $$.getUserInfo().InviteCode;
                    if (navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)) {
                        wx.onMenuShareTimeline({
                            title: '我说过我喜欢你，撩我，扫我，只要你来！', // 分享标题
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
                            title: '我说过我喜欢你，撩我，扫我，只要你来！', // 分享标题
                            desc: '600元代金券和我，从了你。', // 分享描述
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
                            title: '我说过我喜欢你，撩我，扫我，只要你来！', // 分享标题
                            link: $$.config.hostAddr + "wechat/www/web/main/index.html?R=" + escape("icenter/codeRegister.html?RegisterFrom=1&RegisterCont=" + registerCont), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: $$.config.hostAddr + 'wechat/www/web/main/images/icon.png', // 分享图标
                            desc: ' 600元代金券和我，从了你。', // 分享描述
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });

                    } else if (navigator.userAgent.indexOf('csl-android') != -1) {
                        wx.onMenuShowShareView({
                            title: '我说过我喜欢你，撩我，扫我，只要你来！', // 分享标题
                            link: $$.config.hostAddr + "wechat/www/web/main/index.html?R=" + escape("icenter/codeRegister.html?RegisterFrom=1&RegisterCont=" + registerCont), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: $$.config.hostAddr + 'wechat/www/web/main/images/icon.png', // 分享图标
                            desc: '600元代金券和我，从了你。', // 分享描述
                            success: function() {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function() {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    }
                }
            });
            wx.error(function() {});            
        },
        index: function () {
            $$.redirect('home/index.html');
        },
        wash: function() {
            $$.redirect('home/prodservice.html?pid=7');
        }
    };
    $page.find('map').html(template(pageStr + '_map_area', {
        btn1Coords: w * 0.04 + ',' + w * 1.267 + ',' + w * 0.96 + ',' + w * 1.389,
        btn2Coords: w * 0.48 + ',' + w * 1.693 + ',' + w * 0.827 + ',' + w * 1.747,
        //btn3Coords: w * 0.467 + ',' + w * 4.312 + ',' + w * 0.72 + ',' + w * 4.36,
        //btn4Coords: w * 0.467 + ',' + w * 4.544 + ',' + w * 0.747 + ',' + w * 4.587,
        //btn5Coords: w * 0.04 + ',' + w * 4.741 + ',' + w * 0.96 + ',' + w * 4.859
        btn3Coords: w * 0.467 + ',' + w * 4.573 + ',' + w * 0.72 + ',' + w * 4.62,
        btn4Coords: w * 0.467 + ',' + w * 4.8 + ',' + w * 0.747 + ',' + w * 4.846,
        btn5Coords: w * 0.04 + ',' + w * 5.652 + ',' + w * 0.96 + ',' + w * 5.7666
    }));
    $('#home_recommend_qrcode').css({
        width: w * 0.681,
        height: w * 0.681,
        left: w * 0.16,
        top: w * 1.89
    });
});