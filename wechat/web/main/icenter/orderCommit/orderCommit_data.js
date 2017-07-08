$(function() {
    var $page = $('#icenter_orderCommit'),
        pageStr = 'icenter_orderCommit';


    if ($$.isLogin(true)) {

        var bodyHeight = window.innerHeight || document.body.clientHeight,
            $page = $('#icenter_orderCommit'),
            pageStr = 'icenter_orderCommit',
            headerHeight = $page.find('>div.header').height();


        //重置HTML界面
        $page.find("textarea").val("");
        $page.find(".pictures").empty();
        $page.find(".pictures").append("<div class='camera'><i></i></div>")




        // 设置界面高度
        $page.find('>div.main').height(bodyHeight - headerHeight - 1);
        // 设置返回按钮可用
        $$.setGoBack($page.find('>div.header >a.goBack'));
        // 评价点星事件
        $page.on('click', '>div.main >div.stars >i', function() {
            $(this).addClass('star');
            $(this).prevAll().addClass('star');
            $(this).nextAll().removeClass('star');
        });
        // 输入内容剩余字数统计
        $page.on('keyup', '>div.main >textarea', function() {
            var maxTextNum = 500,
                cnt = $(this).val();
            if (cnt.length >= 500) {
                $(this).val(cnt.substring(0, 500));
                $page.find('>div.main >small').text(0);
            } else {
                $page.find('>div.main >small').text(500 - cnt.length);
            }
        });
        // 匿名评价
        $page.on('click', '>div.main >div.anonymity >p', function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
            }
        });

        url = $$.getUrl();
        orderId = $$.getQueryString("oid");
        productId = $$.getQueryString("pid");

        // 获取订单详情
        getOrderDetail();

        function getOrderDetail() {
            $$.post(
                'CSL/Order/QueryOrderDetail', {
                    'ID': orderId
                },
                function(res) {
                    if (res.Status != 0) {
                        return false;
                    }
                    if (res.Data) {
                        var d = res.Data;
                        $page.find('>div.main >div.product').html(template(pageStr + '_product', {
                            cProList: JSON.parse(d.Data),
                            serverAddr: $$.config.serverAddr
                        }));
                    }
                }
            );
        }





        //微信配置

        var WXsign = $$.getWeChatSign();


        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx2c53034422e377cc', // 必填，公众号的唯一标识
            timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
            nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
            signature: WXsign.sign, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });


        //通过ready接口处理成功验证
        wx.ready(function() {});

        wx.error(function(res) {});


        //删除照片
        $page.on("click", ".close img", function() {
            //$page.find(".pictures").remove($(this).parent().parent());
            //在imglist数组中删除照片
            //$page.imgList.splice($(this).attr("data-index"),$(this).attr("data-index"));
        });




        $("#icenter_orderCommit .camera").click(function() {
            wx.chooseImage({
                count: 3, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {

                    $page.imgList = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
                    for (var i = 0; i < $page.imgList.length; i++) {
                        var oneItem = "<div><img src='" + $page.imgList[i] + "' data-index='" + i + "' class='reserve'><div class='close'><img src='images/common/round_close_fill.png' data-index='" + i + "'></div></div>";
                        $page.find(".pictures").prepend(oneItem);
                    }

                    $page.on("click", ".reserve", function() {
                        var j = $(this).attr("data-index");
                        wx.previewImage({
                            current: $page.imgList[j], // 当前显示图片的http链接
                            urls: $page.imgList // 需要预览的图片http链接列表
                        });
                    });

                    $page.on("click", ".commit", function() {
                        upLoad();
                    });

                }
            });
        });


        //添加评论
        function upLoad() {
            var rating = $page.find('>div.main >div.stars >i.star').length;
            $$.post(
                'CSL/Review/AddReview', {
                    OrderID: orderId,
                    ProductID: productId,
                    Cont: $page.find("textarea").val(),
                    Rating: rating * 20
                },
                function(txt) {
                    txt = $$.eval(txt);
                    $page.ReviewID = txt.Data.ID;
                    upImg();
                }
            );
        }

        function upImg() {
            for (var i = 0; i < $page.imgList.length; i++) {
                wx.uploadImage({
                    localId: $page.imgList[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        var serverId = res.serverId;
                        console.log(serverId);
                        //
                        $$.post("CSL/Review/AddReviewImg", {
                            ProductReviewID: $page.ReviewID,
                            Img: serverId,
                            Platform: 1
                        }, function(txt) {
                            console.log(i);
                            console.log($page.imgList.length);
                            if (i == $page.imgList.length) {
                                alert("评论上传成功");
                                $$.redirect("icenter/orderList.html");
                            }
                        });
                    }
                });
            }

        }
    }
});
