/**
 * Created by tianw on 2017/10/24.
 */
$(function() {
    var bodyHeight = window.innerHeight || document.body.clientHeight,
        $page = $('#activity_fightDetal'),
        pageStr = 'activity_fightDetal',
        headerHeight = $page.find('>div.header').height(),
        w = $page.width();

    // 设置界面高度
    $page.find('>div.main').height(
        bodyHeight - headerHeight - 1
    );

    // 返回按钮
    $$.setGoBack($page.find('>div.header >a.goBack'));
        $('.main>.fight>.btn').click(function(){
            var mirror = "<div class='mirror'></div><div class='Popup ' > <div class='Popup-dialog '> <div class='Popup-content'> <div class='Popup-body'> <p>您还没有邀请好友参与拼单呢，不邀请会拼单失败哦~</p> </div> <div class='Popup-footer'> <button type='submit' name='button' value='暂时不邀请' class='btn btn-primary' >暂时不邀请</button> <i></i><button type='submit' name='button' value='去邀请好友' class='btn btn-primary' >去邀请好友</button></div> </div> </div> </div>"
            // "<div class='popup'><div class='popup-body'>您还没有邀请好友参与拼单呢，不邀请会拼单失败哦~</div>" +
            // "<div><button>暂时不邀请</button><button>去邀请好友</button></div></div>";
            $page.append(mirror);
            // var imgurl = $$.serverAddr + "CSL/Service/QueryMyServiceImgBySID?ID=" + id + "&WToken=" + token;
            //     layer.open({
            //         title: "<img src='images/code/qr_code.png' style='width: 6vw;position: absolute;top: 2.8vw;'><span style='margin-left: 8vw;color:#f60'>商家扫描二维码</span>",
            //         content: "<p style='text-align:center;font-size:3.3vw;color:#8e8c8c;margin-bottom: 2vw;'>请向商家出示二维码，扫一扫，即可验证</p><img style='width:70vw;' class='appointment_strCode' src='" + imgurl + "'>" + "<p style='margin-top:2vw'><img src='images/code/logo.png' style='width:25vw;'></p>",
            //         area: ["80vw", "115vw"],
            //         btn: [],
            //         cancel: function() {
            //             clearInterval(time);
            //         }
            //     });
            function popup(){
                $(".Popup").removeClass("Popup_in").addClass("Popup_fade");
                $(".Popup-backdrop").removeClass("Popup_in2").removeClass("Popup_fade").addClass("Popup_fade");
            }

            $(".Popup-header").on("click",".close",function(){//这个是关闭弹出框
                $(".Popup-dialog").animate({top:-1000});
                setTimeout("popup()",300)
            });
            // $("#popup").click(function(){//点击按钮弹出
                $(".Popup-backdrop").toggleClass("Popup_in2");
                $(".Popup").toggleClass("Popup_in");
                $(".Popup-dialog").animate({top:150});
            // });
        })

    // window.recommend = {
    //     invite: function() {
    //         var WXsign = $$.getWeChatSign(1);
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


                        // var mirror = "<div class='mirror'><img src='images/recommend/arrow.png'><p>点击右上角<span>三个点</span>推荐注册有大礼哦~</p></div>";
                        // $page.append(mirror);
                        //
                        // setTimeout(function() {
                        //     $(".mirror").remove();
                        // }, 8000);
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
});