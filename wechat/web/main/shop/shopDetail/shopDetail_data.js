// JavaScript Document
$(function() {
    var $page = $('#shop_shopDetail'),
        pageStr = 'shop_shopDetail';
    var id = $$.getQueryString("ID");

    $('#shop_shopDetail_banner .bd ul').empty();

    //关注点击事件
    $page.off("click", ".btn").on("click", ".btn", function() {
        if ($(this).attr("data-watch") == 0) {
            $$.post("CSL/StoreFollow/AddUpdateFollow", { StoreID: id },
                function(txt) {
                    if (txt.Status == 0) {
                        $page.find(".btn").attr("data-watch", "1");
                        $page.find(".btn img").attr("src", "images/common/like_fill.png");
                        layer.msg("关注成功");
                    }
                }
            );
        } else {
            layer.confirm("是否要取消关注", function(index) {
                $$.post("CSL/StoreFollow/DeleteFollow", { StoreID: id },
                    function(txt) {
                        if (txt.Status == 0) {
                            $page.find(".btn").attr("data-watch", "0");
                            $page.find(".btn img").attr("src", "images/common/like.png");
                            layer.msg("取消关注成功");
                        }
                    }
                );
            });
        }
    });

    //购买服务
    $page.off("click",".oneService button").on("click",".oneService button",function(){
        var serviceID=$(this).attr("data-id");
        $$.redirect("home/prodStore.html?sid="+serviceID);
    });
    //微信配置
    var WXsign = $$.getWeChatSign(1);
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: $$.config.wxAppID, // 必填，公众号的唯一标识
        timestamp: WXsign.timestamp, // 必填，生成签名的时间戳
        nonceStr: WXsign.noncestr, // 必填，生成签名的随机串
        signature: WXsign.sign, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    function checkInfo(data, name) {
        if (data.hasOwnProperty("Children")) {
            data = data.Children;
            for (var i = 0; i < data.length; i++) {
                if (data[i].Name == name) {
                    return data[i].Value;
                } else {

                }
            }
        } else {

        }
    }

    //获取门店基本信息
    $.ajax({
        type: "POST",
        url: $$.config.serverAddr + "Product/Store/QueryStoreDetail",
        data: {
            ID: id
        },
        dataType: "json",
        success: function(txt) {
            if (txt.Status == 0) {
                $page.find(".storeName").html(txt.Data.Name);
                $page.find(".storeNum").html(txt.Data.WDeviceNum || 0);
                $page.find(".storeAddr").html(txt.Data.Address);
                $page.find(".call").attr("href", "tel:" + txt.Data.Phone);
                $page.find(".storePhone").html(txt.Data.Phone);
                if (txt.Data.Params) {
                    $page.find(".saleTime span").html(checkInfo(JSON.parse(txt.Data.Params)[0], "营业开始时间") + "-" + checkInfo(JSON.parse(txt.Data.Params)["0"].Children, "营业结束时间"));
                    $page.find(".storeArea span").html(checkInfo(JSON.parse(txt.Data.Params)[0], "店铺面积") + "平方米");
                } else {
                    $page.find(".saleTime span").html("暂未获取");
                    $page.find(".storeArea span").html("暂未获取");
                }

                if (txt.Data.ImgList) {
                    var imgList = txt.Data.ImgList.split(",");
                    for (var i = 0; i < imgList.length; i++) {
                        $('#shop_shopDetail_banner .bd ul').append("<li><img src='" + $$.config.serverAddr + "Img/" + imgList[i] + "'></li>");
                    }
                }
                bannerSlide();

                $page.off("click", ".map").on("click", ".map", function() {
                    wx.openLocation({
                        latitude: txt.Data.Latitude, // 纬度，浮点数，范围为90 ~ -90
                        longitude: txt.Data.Longitude, // 经度，浮点数，范围为180 ~ -180。
                        name: txt.Data.Name, // 位置名
                        address: txt.Data.Address, // 地址详情说明
                        scale: 24, // 地图缩放级别,整形值,范围从1~28。默认为最大
                        infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                    });
                });
            }
        }
    });

    //获取门店服务列表
    $.ajax({
        type: "POST",
        url: $$.config.serverAddr + "Product/StoreService/QueryServiceJson",
        data: {
            StoreID: id
        },
        dataType: "json",
        success: function(txt) {
            $page.find(".storeService").show();
            $page.find(".adv").hide();
            $page.find(".serviceNav ul").empty();
            $page.find(".serviceContent").empty();
            var serviceList = txt.Data,
                navNode = "";
            serviceNode = "";
            if (serviceList.length == 0) {
                $page.find(".storeService").hide();
                $page.find(".adv").show();
            }
            for (var i = 0; i < serviceList.length; i++) {
                navNode += '<li data-content="service' + i + '">' + serviceList[i].CategoryName + '</li>';
                $page.find(".serviceContent").append('<div class="service' + i + ' item"></div>');
                for (var j = 0; j < serviceList[i].Children.length; j++) {
                    serviceNode = '<div class="oneService">' +
                        '<p class="serviceTitle">' + serviceList[i].Children[j].ProductName + '</p>' +
                        '<p class="serviceDesci">' + serviceList[i].Children[j].Descri + '</p>' +
                        '<p class="price"><span>¥' + serviceList[i].Children[j].NewPrice + '</span><button data-id="'+serviceList[i].Children[j].ID+'">购买</button></p>' +
                        '</div>';
                    $page.find(".service" + i).append(serviceNode);
                }
            }
            $page.find(".serviceNav ul").append(navNode);
            $page.find(".serviceNav ul li:first-child").addClass("active");
            $page.find(".serviceContent div:first-child").addClass("active");
        }
    });

    //轮播图
    function bannerSlide() {
        TouchSlide({
            slideCell: "#shop_shopDetail_banner",
            titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell: ".bd ul",
            effect: "left",
            autoPlay: true, //自动播放
            autoPage: true, //自动分页
            switchLoad: "_src", //切换加载，真实图片路径为"_src" 
            interTime: 3000 // 切换间隔时间，毫秒
        });
    }

    //获取是否关注
    $$.post("CSL/StoreFollow/QueryFollowDetail", { StoreID: id },
        function(txt) {
            if (txt.Status == 0) {
                $page.find(".btn").attr("data-watch", "1");
                $page.find(".btn img").attr("src", "images/common/like_fill.png");
            } else {
                $page.find(".btn").attr("data-watch", "0");
                $page.find(".btn img").attr("src", "images/common/like.png");
            }
        }
    );


});