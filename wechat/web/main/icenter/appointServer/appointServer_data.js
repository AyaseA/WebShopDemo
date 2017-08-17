$(function() {
    var $page = $("#icenter_appointServer");

    var contentHeight = window.innerHeight - $page.find(".header").height();
    $page.find(".content").height(contentHeight);

    var sid = $$.getQueryString("sid");

    //可以上传照片数量
    window.photoNum = 3;
    //配置微信签名
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
    wx.ready(function() {});

    wx.error(function(res) {});

    //店面出现事件
    $page.off("click", ".selectStore .selectDetail").on("click", ".selectStore .selectDetail", function() {
        $page.find(".storeInfo").animate({ top: "-124vw" }, 500);
    });

    //点击店面隐藏事件
    $page.off("click", ".selectTitle img").on("click", ".selectTitle img", function() {
        $page.find(".storeInfo").animate({ top: "0vw" }, 500);
    });

    //时间出现事件
    $page.off("click", ".selectDate .selectDetail").on("click", ".selectDate .selectDetail", function() {
        $page.find(".dateInfo").animate({ top: "-226vw" }, 500);
    });

    //点击时间隐藏事件
    $page.off("click", ".dateTitle img").on("click", ".dateTitle img", function() {
        $page.find(".dateInfo").animate({ top: "-122vw" }, 500);
    });

    // 选择店面
    $page.off('click', '.storeContent .item').on('click', '.storeContent .item', function() {
        if (!$(this).hasClass('checked')) {
            $(this).addClass('checked').siblings().removeClass('checked');
        }

        $page.find(".storeConfirm").css("background-color", "#f60");
    });

    //选择时间
    $page.off('click', '.dateContent span.am, .dateContent span.pm').on('click', '.dateContent span.am, .dateContent span.pm', function() {
        $page.find('.dateContent span.am, .dateContent span.pm').removeClass('selected');
        $(this).addClass('selected');
    });

    //选择确认服务商店
    $page.off("click", ".storeConfirm").on("click", ".storeConfirm", function() {
        if ($page.find(".storeContent .checked").length != 0) {
            var selectName = $($page.find(".storeContent .checked")[0]).attr("data-name");
            var selectSid = $($page.find(".storeContent .checked")[0]).attr("data-store-id");
            $page.find(".selectStore .selectDetail span").text(selectName);
            $page.find(".selectStore .selectDetail span").attr("data-store-id", selectSid);
            $page.find(".storeInfo").animate({ top: "0vw" }, 500);
        }
    });

    //选择确认服务时间
    $page.off("click", ".dateConfirm").on("click", ".dateConfirm", function() {
        var selectDate = $($page.find(".dateContent .item .selected")[0]).attr("data-date");
        var selectTime = $($page.find(".dateContent .item .selected")[0]).attr("data-time");
        $page.find(".selectDate .selectDetail span").text(selectDate + "  " + selectTime);
        $page.find(".selectDate .selectDetail span").attr("data-date",selectDate);
        $page.find(".dateInfo").animate({ top: "-122vw" }, 500);
    });

    //选择照片/拍照
    $page.off("click", ".photo").on("click", ".photo", function(e) {
        if( window.photoNum != 0){
            wx.chooseImage({
                count: window.photoNum, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    $page.imgList = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
                    for (var i = 0; i < $page.imgList.length; i++) {
                        var oneItem = "<div class='photolist'><img src='" + $page.imgList[i] + "' data-index='" + i + "' class='reserve'><div class='close'><img src='images/common/round_close.png' data-index='" + i + "'></div></div>";
                        $page.find(".camera").append(oneItem);
                    }
                    window.photoNum -= $page.imgList.length;
                    //删除照片              
                }
            });
        }else{
            layer.msg("最多上传3张图片");
        }

    });

    //查看删除照片
    $page.off("click", ".close img").on("click", ".close img", function() {
        var _this = $(this);
        layer.confirm("确定要删除此照片吗", function(index) {
            _this.parent().parent().remove();
            window.photoNum += 1;
            layer.close(index);
        });
    });

    //提交预约信息
    $page.off("click",".sumbit").on("click",".sumbit",function(){
        if(!$page.find(".selectStore .selectDetail span").attr("data-store-id")){
            layer.msg("请选择预约门店");
        }else if(!$page.find(".selectDate .selectDetail span").attr("data-date")){
            layer.msg("请选择预约时间");
        }else{
            $$.post("CSL/Appointment/AddAppoint",
                {
                   ServiceID:sid,
                   Platform:10,
                   Descri:$page.find(".serverDetail textarea").val(),
                   AppointDate:$$.get10Time($page.find(".selectDate .selectDetail span").attr("data-date"))
                },
                function(){
                    $$.post("CSL/Service/UpdateMyServiceStoreID",
                    {
                        ID:sid,
                        StoreID:$page.find(".selectStore .selectDetail span").attr("data-store-id")
                    },
                    function(txt){
                        if(txt.Status==0){
                            layer.msg("服务预约成功");
                            $$.redirect("icenter/appointmentList.html");
                        }
                    }
                );
                }
            );
        }
    });

    //获取有此服务的店面
    $$.post("Product/StoreService/QueryMapByProductServiceID", {
        N: 1,
        Rows: 9999,
        ProductServiceID: sid
    }, function(txt) {
        if (txt.Status == 0) {
            var d = txt.Data.Rows;
            $page.find('.storeContent').html(template('icenter_appointServer_store_items', {
                stores: d
            }));
        }
    });


    //获取时间信息
    getAppointTime(function(timeArr) {
        $page.find('.dateContent').html(template('icenter_appointServer_time_list', {
            list: timeArr
        }));
    });

    // 计算预约时间
    function getAppointTime(callback) {
        var timeArr = [];
        for (var i = 1; i <= 30; i++) {
            timeArr.push(
                getDateFromCurrentDate(i)
            );
        }
        callback(timeArr);
    }

    function getDateFromCurrentDate(dayInterval) {
        var curDate = new Date();
        curDate.setDate(curDate.getDate() + dayInterval);
        var year = curDate.getFullYear();
        var month = (curDate.getMonth() + 1) < 10 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);
        var day = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
        return year + "-" + month + "-" + day;
    }
});